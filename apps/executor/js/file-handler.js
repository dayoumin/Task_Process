class FileHandler {
    constructor(dbManager, onProcessLoaded) {
        this.db = dbManager;
        this.onProcessLoaded = onProcessLoaded;
    }

    setupDropZone(dropZoneElement) {
        dropZoneElement.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZoneElement.classList.add('drag-over');
        });

        dropZoneElement.addEventListener('dragleave', () => {
            dropZoneElement.classList.remove('drag-over');
        });

        dropZoneElement.addEventListener('drop', async (e) => {
            e.preventDefault();
            dropZoneElement.classList.remove('drag-over');

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                await this.handleFileUpload(files[0]);
            }
        });

        dropZoneElement.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = async (e) => {
                if (e.target.files.length > 0) {
                    await this.handleFileUpload(e.target.files[0]);
                }
            };
            input.click();
        });
    }

    async handleFileUpload(file) {
        if (!file.name.endsWith('.json')) {
            alert('JSON 파일만 업로드할 수 있습니다.');
            return;
        }

        try {
            const text = await file.text();
            const process = JSON.parse(text);

            if (!this.validateProcess(process)) {
                alert('유효하지 않은 프로세스 파일입니다.');
                return;
            }

            await this.db.addProcess(process);

            if (this.onProcessLoaded) {
                this.onProcessLoaded(process);
            }
        } catch (error) {
            console.error('파일 로드 오류:', error);
            alert('파일을 로드하는 중 오류가 발생했습니다: ' + error.message);
        }
    }

    validateProcess(process) {
        if (!process.id || !process.name || !process.version) {
            console.error('필수 필드 누락: id, name, version');
            return false;
        }

        if (!Array.isArray(process.steps) || process.steps.length === 0) {
            console.error('steps 배열이 없거나 비어있습니다');
            return false;
        }

        for (const step of process.steps) {
            if (!step.id || !step.title) {
                console.error('단계에 필수 필드 누락: id, title');
                return false;
            }

            if (!Array.isArray(step.checklist)) {
                console.error('checklist가 배열이 아닙니다');
                return false;
            }

            if (!Array.isArray(step.fields)) {
                console.error('fields가 배열이 아닙니다');
                return false;
            }

            for (const field of step.fields) {
                if (!field.id || !field.type || !field.label) {
                    console.error('필드에 필수 속성 누락: id, type, label');
                    return false;
                }

                const validTypes = ['text', 'number', 'date', 'file', 'textarea'];
                if (!validTypes.includes(field.type)) {
                    console.error('유효하지 않은 필드 타입:', field.type);
                    return false;
                }
            }
        }

        return true;
    }

    async loadProcessFromFile() {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';

            input.onchange = async (e) => {
                if (e.target.files.length > 0) {
                    try {
                        await this.handleFileUpload(e.target.files[0]);
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                }
            };

            input.click();
        });
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
}
