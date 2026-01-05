class UIManager {
    constructor(executor, tracker) {
        this.executor = executor;
        this.tracker = tracker;
    }

    async renderProcessList(processes, currentProcessId) {
        const listElement = document.getElementById('process-list');

        if (processes.length === 0) {
            listElement.innerHTML = '<p class="empty-message">프로세스를 로드하세요</p>';
            return;
        }

        const processItems = await Promise.all(processes.map(async process => {
            const isActive = process.id === currentProcessId;
            const progress = await this.executor.db.getProgress(process.id);
            const progressPercent = progress ? this.tracker.calculateProgress(process, progress) : 0;

            return `
                <div class="process-item ${isActive ? 'active' : ''}" data-process-id="${process.id}">
                    <div class="process-item-header">
                        <div>
                            <div class="process-item-title">${process.name}</div>
                            <div class="process-item-meta">v${process.version}</div>
                        </div>
                        ${this.renderPriorityBadge(process.tracking?.priority)}
                    </div>
                    <div class="process-progress">
                        <div class="process-progress-text">${progressPercent}% 완료</div>
                        <div class="process-progress-bar">
                            <div class="process-progress-fill" style="width: ${progressPercent}%"></div>
                        </div>
                    </div>
                </div>
            `;
        }));

        listElement.innerHTML = processItems.join('');

        listElement.querySelectorAll('.process-item').forEach(item => {
            item.addEventListener('click', async () => {
                const processId = item.dataset.processId;
                await window.app.loadAndStartProcess(processId);
            });
        });
    }

    renderPriorityBadge(priority) {
        if (!priority) return '';

        const badges = {
            high: 'badge-high',
            medium: 'badge-medium',
            low: 'badge-low'
        };

        const labels = {
            high: '높음',
            medium: '보통',
            low: '낮음'
        };

        return `<span class="process-badge ${badges[priority]}">${labels[priority]}</span>`;
    }

    renderTrackingInfo(process, progress) {
        const element = document.getElementById('tracking-info');
        const tracking = process.tracking;

        if (!tracking) {
            element.style.display = 'none';
            return;
        }

        element.style.display = 'block';

        const statusInfo = this.tracker.getStatusLabel(progress);
        const deadlineInfo = this.tracker.getDeadlineStatus(tracking.dueDate);
        const timeRemaining = this.tracker.calculateTimeRemaining(tracking, progress);

        element.innerHTML = `
            <div class="tracking-grid">
                <div class="tracking-item">
                    <div class="tracking-label">담당자</div>
                    <div class="tracking-value">${tracking.assignedToName || '미지정'}</div>
                </div>
                <div class="tracking-item">
                    <div class="tracking-label">부서</div>
                    <div class="tracking-value">${tracking.departmentName || '미지정'}</div>
                </div>
                <div class="tracking-item">
                    <div class="tracking-label">상태</div>
                    <div class="tracking-value tracking-status">
                        <span class="status-indicator ${statusInfo.class}"></span>
                        ${statusInfo.label}
                    </div>
                </div>
                ${deadlineInfo ? `
                <div class="tracking-item">
                    <div class="tracking-label">마감일</div>
                    <div class="tracking-value tracking-deadline ${deadlineInfo.class}">
                        ${deadlineInfo.label}
                    </div>
                </div>
                ` : ''}
            </div>
            ${timeRemaining ? `
            <div class="tracking-progress-stats">
                <div class="progress-stats-row">
                    <span class="progress-stats-label">예상 소요 시간</span>
                    <span class="progress-stats-value">${tracking.estimatedHours}시간</span>
                </div>
                <div class="progress-stats-row">
                    <span class="progress-stats-label">남은 예상 시간</span>
                    <span class="progress-stats-value">${timeRemaining.hours}시간 ${timeRemaining.minutes}분</span>
                </div>
            </div>
            ` : ''}
        `;
    }

    renderProcessHeader(process) {
        const element = document.getElementById('process-header');
        element.innerHTML = `
            <h2>${process.name}</h2>
            <div class="version">버전 ${process.version}</div>
        `;
    }

    renderProgressBar(progress) {
        const element = document.getElementById('progress-bar');
        element.style.width = progress + '%';
    }

    renderStep(step, stepData, validationErrors = {}) {
        const element = document.getElementById('step-content');

        const isLastStep = this.executor.currentStepIndex === this.executor.currentProcess.steps.length - 1;

        if (isLastStep && this.executor.isCompleted()) {
            element.innerHTML = this.renderCompletionScreen();
            return;
        }

        element.innerHTML = `
            <h3 class="step-title">${step.title}</h3>
            <p class="step-description">${step.description}</p>

            ${step.checklist && step.checklist.length > 0 ? this.renderChecklist(step, stepData, validationErrors) : ''}
            ${step.fields && step.fields.length > 0 ? this.renderFields(step, stepData, validationErrors) : ''}
        `;

        this.validationErrors = validationErrors;
        this.attachEventListeners(step);
    }

    renderChecklist(step, stepData, validationErrors = {}) {
        return `
            <div class="checklist">
                <h4 class="checklist-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M9 11l3 3L22 4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    체크리스트
                </h4>
                ${step.checklist.map(item => {
                    const checked = stepData?.checklist?.[item.id] || false;
                    const errorKey = `checklist-${item.id}`;
                    const hasError = validationErrors[errorKey];
                    return `
                        <div class="checklist-item ${item.required ? 'required' : ''} ${hasError ? 'error' : ''}">
                            <input type="checkbox"
                                   id="check-${item.id}"
                                   ${checked ? 'checked' : ''}
                                   data-item-id="${item.id}">
                            <label for="check-${item.id}">${item.text}</label>
                            ${hasError ? `
                                <span class="error-text">
                                    <svg viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                                    </svg>
                                    ${validationErrors[errorKey]}
                                </span>
                            ` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    renderFields(step, stepData, validationErrors = {}) {
        return `
            <div class="form-fields">
                ${step.fields.map(field => this.renderField(field, stepData?.fields?.[field.id], validationErrors)).join('')}
            </div>
        `;
    }

    renderField(field, value, validationErrors = {}) {
        const labelClass = field.required ? 'required' : '';
        const errorKey = `field-${field.id}`;
        const hasError = validationErrors[errorKey];
        const errorClass = hasError ? 'error' : '';
        const errorHTML = hasError ? `
            <div class="error-text">
                <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
                ${validationErrors[errorKey]}
            </div>
        ` : '';

        switch (field.type) {
            case 'text':
                return `
                    <div class="form-group ${errorClass}">
                        <label class="${labelClass}">${field.label}</label>
                        <input type="text"
                               data-field-id="${field.id}"
                               data-field-label="${field.label}"
                               value="${value || ''}"
                               placeholder="${field.placeholder || ''}">
                        ${errorHTML}
                    </div>
                `;

            case 'number':
                return `
                    <div class="form-group ${errorClass}">
                        <label class="${labelClass}">${field.label}</label>
                        <input type="number"
                               data-field-id="${field.id}"
                               data-field-label="${field.label}"
                               value="${value || ''}"
                               placeholder="${field.placeholder || ''}">
                        ${errorHTML}
                    </div>
                `;

            case 'date':
                return `
                    <div class="form-group ${errorClass}">
                        <label class="${labelClass}">${field.label}</label>
                        <input type="date"
                               data-field-id="${field.id}"
                               data-field-label="${field.label}"
                               value="${value || ''}">
                        ${errorHTML}
                    </div>
                `;

            case 'textarea':
                return `
                    <div class="form-group ${errorClass}">
                        <label class="${labelClass}">${field.label}</label>
                        <textarea data-field-id="${field.id}"
                                  data-field-label="${field.label}"
                                  placeholder="${field.placeholder || ''}">${value || ''}</textarea>
                        ${errorHTML}
                    </div>
                `;

            case 'file':
                const fileName = value?.fileName || '';
                const fileSize = value?.fileSize ? window.fileHandler.formatFileSize(value.fileSize) : '';
                return `
                    <div class="form-group ${errorClass}">
                        <label class="${labelClass}">${field.label}</label>
                        <div class="file-input-wrapper">
                            <label class="file-input-label ${errorClass}">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                                파일 선택
                                <input type="file"
                                       data-field-id="${field.id}"
                                       data-field-label="${field.label}"
                                       accept="${field.validation?.accept || '*'}">
                            </label>
                            ${fileName ? `
                                <div class="file-name">
                                    ${fileName}
                                    <span class="file-size">(${fileSize})</span>
                                </div>
                            ` : ''}
                        </div>
                        ${errorHTML}
                    </div>
                `;

            default:
                return '';
        }
    }

    renderCompletionScreen() {
        return `
            <div class="completion-screen">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M22 4L12 14.01l-3-3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <h3>프로세스 완료!</h3>
                <p>모든 단계를 완료했습니다. 이제 결과를 내보낼 수 있습니다.</p>
            </div>
        `;
    }

    attachEventListeners(step) {
        document.querySelectorAll('.checklist-item input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', async (e) => {
                const itemId = e.target.dataset.itemId;
                await this.executor.updateChecklistItem(step.id, itemId, e.target.checked);
                // Clear validation error for this checkbox
                this.clearValidationError(`checklist-${itemId}`);
            });
        });

        document.querySelectorAll('input[data-field-id], textarea[data-field-id]').forEach(input => {
            if (input.type === 'file') {
                input.addEventListener('change', async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        try {
                            const fieldId = input.dataset.fieldId;
                            const fieldLabel = input.dataset.fieldLabel;
                            await this.executor.uploadFile(step.id, fieldId, fieldLabel, file);
                            this.clearValidationError(`field-${fieldId}`);
                            this.renderStep(step, this.executor.currentProgress.stepData[step.id]);
                        } catch (error) {
                            alert(error.message);
                        }
                    }
                });
            } else {
                input.addEventListener('input', async (e) => {
                    const fieldId = e.target.dataset.fieldId;
                    const fieldLabel = e.target.dataset.fieldLabel;
                    await this.executor.updateField(step.id, fieldId, fieldLabel, e.target.value);
                    // Clear validation error as user types
                    this.clearValidationError(`field-${fieldId}`);
                });
            }
        });
    }

    clearValidationError(errorKey) {
        if (!this.validationErrors) return;

        if (this.validationErrors[errorKey]) {
            delete this.validationErrors[errorKey];

            // Remove error class and error message from DOM
            const isChecklistError = errorKey.startsWith('checklist-');
            const id = errorKey.replace(/^(checklist|field)-/, '');

            if (isChecklistError) {
                const checkItem = document.querySelector(`input[data-item-id="${id}"]`)?.closest('.checklist-item');
                if (checkItem) {
                    checkItem.classList.remove('error');
                    const errorText = checkItem.querySelector('.error-text');
                    if (errorText) errorText.remove();
                }
            } else {
                const formGroup = document.querySelector(`input[data-field-id="${id}"], textarea[data-field-id="${id}"]`)?.closest('.form-group');
                if (formGroup) {
                    formGroup.classList.remove('error');
                    const errorText = formGroup.querySelector('.error-text');
                    if (errorText) errorText.remove();
                }
            }
        }
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const exportBtn = document.getElementById('export-btn');

        prevBtn.disabled = !this.executor.canGoPrevious();

        if (this.executor.isCompleted()) {
            nextBtn.style.display = 'none';
            exportBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            exportBtn.style.display = 'none';
            nextBtn.textContent = this.executor.canGoNext() ? '다음' : '완료';
        }
    }

    showWelcomeScreen() {
        document.getElementById('welcome-screen').style.display = 'flex';
        document.getElementById('process-screen').style.display = 'none';
    }

    showProcessScreen() {
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('process-screen').style.display = 'block';
    }
}
