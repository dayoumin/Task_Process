class ProcessExecutor {
    constructor(dbManager, trackingLogger) {
        this.db = dbManager;
        this.tracker = trackingLogger;
        this.currentProcess = null;
        this.currentProgress = null;
        this.currentStepIndex = 0;
        this.autoSaveTimer = null;
    }

    async loadProcess(processId) {
        this.currentProcess = await this.db.getProcess(processId);
        this.currentProgress = await this.db.getProgress(processId);

        if (!this.currentProgress) {
            this.currentProgress = {
                processId,
                status: 'not-started',
                currentStepIndex: 0,
                completedSteps: [],
                stepData: {},
                startedAt: null,
                completedAt: null,
                totalSteps: this.currentProcess.steps.length
            };
            await this.db.saveProgress(this.currentProgress);
        }

        this.currentStepIndex = this.currentProgress.currentStepIndex || 0;

        if (!this.currentProgress.startedAt) {
            this.currentProgress.startedAt = new Date().toISOString();
            this.currentProgress.status = 'in-progress';
            await this.db.saveProgress(this.currentProgress);
            await this.tracker.logProcessStart(processId, this.currentProcess.name);
        }

        return this.currentProcess;
    }

    getCurrentStep() {
        if (!this.currentProcess) return null;
        return this.currentProcess.steps[this.currentStepIndex];
    }

    async nextStep() {
        const currentStep = this.getCurrentStep();
        if (!currentStep) return { success: false };

        const validation = this.validateStep(currentStep);
        if (!validation.isValid) {
            return { success: false, errors: validation.errors };
        }

        if (!this.currentProgress.completedSteps.includes(currentStep.id)) {
            this.currentProgress.completedSteps.push(currentStep.id);

            const stepStartTime = this.currentProgress.stepStartTimes?.[currentStep.id];
            if (stepStartTime) {
                const duration = Date.now() - new Date(stepStartTime).getTime();
                await this.tracker.logStepComplete(
                    this.currentProcess.id,
                    currentStep.id,
                    currentStep.title,
                    duration
                );
            }
        }

        if (this.currentStepIndex < this.currentProcess.steps.length - 1) {
            this.currentStepIndex++;
            this.currentProgress.currentStepIndex = this.currentStepIndex;

            const nextStep = this.getCurrentStep();
            if (!this.currentProgress.stepStartTimes) {
                this.currentProgress.stepStartTimes = {};
            }
            this.currentProgress.stepStartTimes[nextStep.id] = new Date().toISOString();

            await this.tracker.logStepStart(
                this.currentProcess.id,
                nextStep.id,
                nextStep.title
            );
        } else {
            this.currentProgress.status = 'completed';
            this.currentProgress.completedAt = new Date().toISOString();

            const totalDuration = new Date(this.currentProgress.completedAt) - new Date(this.currentProgress.startedAt);
            await this.tracker.logProcessComplete(
                this.currentProcess.id,
                this.currentProcess.name,
                totalDuration
            );
        }

        await this.db.saveProgress(this.currentProgress);
        return { success: true };
    }

    async previousStep() {
        if (this.currentStepIndex > 0) {
            this.currentStepIndex--;
            this.currentProgress.currentStepIndex = this.currentStepIndex;
            await this.db.saveProgress(this.currentProgress);
            return true;
        }
        return false;
    }

    validateStep(step) {
        if (!step.checklist && !step.fields) return { isValid: true, errors: {} };

        const stepData = this.currentProgress.stepData[step.id] || {};
        const errors = {};

        if (step.checklist) {
            for (const item of step.checklist) {
                if (item.required && !stepData.checklist?.[item.id]) {
                    errors[`checklist-${item.id}`] = `이 항목은 필수입니다`;
                }
            }
        }

        if (step.fields) {
            for (const field of step.fields) {
                const value = stepData.fields?.[field.id];

                if (field.required && !value) {
                    errors[`field-${field.id}`] = `이 필드는 필수입니다`;
                } else if (value && field.validation) {
                    // Additional validation for filled fields
                    if (field.type === 'text' && field.validation.minLength) {
                        if (value.length < field.validation.minLength) {
                            errors[`field-${field.id}`] = `최소 ${field.validation.minLength}자 이상 입력하세요`;
                        }
                    }
                    if (field.type === 'text' && field.validation.maxLength) {
                        if (value.length > field.validation.maxLength) {
                            errors[`field-${field.id}`] = `최대 ${field.validation.maxLength}자까지 입력 가능합니다`;
                        }
                    }
                    if (field.type === 'number' && field.validation.min !== undefined) {
                        if (Number(value) < field.validation.min) {
                            errors[`field-${field.id}`] = `${field.validation.min} 이상의 값을 입력하세요`;
                        }
                    }
                    if (field.type === 'number' && field.validation.max !== undefined) {
                        if (Number(value) > field.validation.max) {
                            errors[`field-${field.id}`] = `${field.validation.max} 이하의 값을 입력하세요`;
                        }
                    }
                    if (field.validation.pattern) {
                        const regex = new RegExp(field.validation.pattern);
                        if (!regex.test(value)) {
                            errors[`field-${field.id}`] = field.validation.message || '올바른 형식이 아닙니다';
                        }
                    }
                }
            }
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    async updateChecklistItem(stepId, itemId, checked) {
        if (!this.currentProgress.stepData[stepId]) {
            this.currentProgress.stepData[stepId] = { checklist: {}, fields: {} };
        }

        if (!this.currentProgress.stepData[stepId].checklist) {
            this.currentProgress.stepData[stepId].checklist = {};
        }

        this.currentProgress.stepData[stepId].checklist[itemId] = checked;
        this.scheduleAutoSave();
    }

    async updateField(stepId, fieldId, fieldLabel, value) {
        if (!this.currentProgress.stepData[stepId]) {
            this.currentProgress.stepData[stepId] = { checklist: {}, fields: {} };
        }

        if (!this.currentProgress.stepData[stepId].fields) {
            this.currentProgress.stepData[stepId].fields = {};
        }

        this.currentProgress.stepData[stepId].fields[fieldId] = value;

        await this.tracker.logFieldUpdate(
            this.currentProcess.id,
            fieldId,
            fieldLabel,
            value
        );

        this.scheduleAutoSave();
    }

    async uploadFile(stepId, fieldId, fieldLabel, file) {
        const field = this.getCurrentStep().fields.find(f => f.id === fieldId);

        if (field.validation) {
            if (field.validation.maxSize && file.size > field.validation.maxSize) {
                const maxSizeMB = (field.validation.maxSize / (1024 * 1024)).toFixed(2);
                throw new Error(`파일 크기가 너무 큽니다. 최대 ${maxSizeMB}MB까지 업로드 가능합니다.`);
            }

            if (field.validation.accept) {
                const allowedExtensions = field.validation.accept.split(',').map(ext => ext.trim());
                const fileExtension = '.' + file.name.split('.').pop();
                if (!allowedExtensions.includes(fileExtension)) {
                    throw new Error(`허용되지 않는 파일 형식입니다. ${field.validation.accept} 파일만 업로드 가능합니다.`);
                }
            }
        }

        const savedFile = await this.db.saveFile(this.currentProcess.id, fieldId, file);

        await this.updateField(stepId, fieldId, fieldLabel, {
            fileId: savedFile.id,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
        });

        await this.tracker.logFileUpload(
            this.currentProcess.id,
            fieldId,
            file.name,
            file.size
        );

        return savedFile;
    }

    scheduleAutoSave() {
        if (this.autoSaveTimer) {
            clearTimeout(this.autoSaveTimer);
        }

        this.autoSaveTimer = setTimeout(async () => {
            await this.db.saveProgress(this.currentProgress);
        }, 500);
    }

    getProgress() {
        if (!this.currentProcess) return 0;
        return Math.round((this.currentProgress.completedSteps.length / this.currentProcess.steps.length) * 100);
    }

    isCompleted() {
        return this.currentProgress?.status === 'completed';
    }

    canGoNext() {
        return this.currentStepIndex < this.currentProcess.steps.length - 1;
    }

    canGoPrevious() {
        return this.currentStepIndex > 0;
    }

    async exportToZip() {
        const zip = new JSZip();

        zip.file('process.json', JSON.stringify(this.currentProcess, null, 2));
        zip.file('progress.json', JSON.stringify(this.currentProgress, null, 2));

        const logs = await this.db.getLogsByProcess(this.currentProcess.id);
        zip.file('logs.json', JSON.stringify(logs, null, 2));

        const files = await this.db.getFilesByProcess(this.currentProcess.id);

        if (files.length > 0) {
            const filesFolder = zip.folder('files');

            for (const fileData of files) {
                filesFolder.file(fileData.name, fileData.blob);
            }
        }

        const blob = await zip.generateAsync({ type: 'blob' });

        const fileName = `${this.currentProcess.id}_${new Date().toISOString().split('T')[0]}.zip`;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);

        return fileName;
    }
}
