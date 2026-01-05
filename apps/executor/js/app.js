class App {
    constructor() {
        this.dbManager = new IndexedDBManager();
        this.trackingLogger = null;
        this.processExecutor = null;
        this.fileHandler = null;
        this.chatbot = null;
        this.ui = null;
    }

    async init() {
        try {
            await this.dbManager.init();

            this.trackingLogger = new TrackingLogger(this.dbManager);
            this.processExecutor = new ProcessExecutor(this.dbManager, this.trackingLogger);
            this.ui = new UIManager(this.processExecutor, this.trackingLogger);
            this.chatbot = new ChatbotManager();

            this.fileHandler = new FileHandler(this.dbManager, async (process) => {
                await this.loadProcessList();
                await this.loadAndStartProcess(process.id);
            });

            this.setupEventListeners();
            await this.loadProcessList();

        } catch (error) {
            console.error('앱 초기화 오류:', error);
            alert('앱을 초기화하는 중 오류가 발생했습니다: ' + error.message);
        }
    }

    setupEventListeners() {
        const dropZone = document.getElementById('drop-zone');
        this.fileHandler.setupDropZone(dropZone);

        const loadProcessBtn = document.getElementById('load-process-btn');
        const fileInput = document.getElementById('process-file-input');

        loadProcessBtn.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', async (e) => {
            if (e.target.files.length > 0) {
                await this.fileHandler.handleFileUpload(e.target.files[0]);
            }
        });

        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const exportBtn = document.getElementById('export-btn');

        prevBtn.addEventListener('click', async () => {
            await this.previousStep();
        });

        nextBtn.addEventListener('click', async () => {
            await this.nextStep();
        });

        exportBtn.addEventListener('click', async () => {
            await this.exportProcess();
        });
    }

    async loadProcessList() {
        const processes = await this.dbManager.getAllProcesses();
        const currentProcessId = this.processExecutor.currentProcess?.id;
        await this.ui.renderProcessList(processes, currentProcessId);
    }

    async loadAndStartProcess(processId) {
        try {
            const process = await this.processExecutor.loadProcess(processId);

            this.ui.showProcessScreen();

            await this.renderCurrentState();

            this.chatbot.updateContext(process, this.processExecutor.getCurrentStep());

            if (process.tracking?.dueDate) {
                await this.trackingLogger.createDeadlineNotification(
                    process.id,
                    process.name,
                    process.tracking.dueDate
                );
            }

        } catch (error) {
            console.error('프로세스 로드 오류:', error);
            alert('프로세스를 로드하는 중 오류가 발생했습니다: ' + error.message);
        }
    }

    async renderCurrentState(validationErrors = {}) {
        const process = this.processExecutor.currentProcess;
        const progress = this.processExecutor.currentProgress;
        const step = this.processExecutor.getCurrentStep();
        const stepData = progress.stepData[step.id];

        this.ui.renderTrackingInfo(process, progress);
        this.ui.renderProcessHeader(process);
        this.ui.renderProgressBar(this.processExecutor.getProgress());
        this.ui.renderStep(step, stepData, validationErrors);
        this.ui.updateNavigation();

        await this.loadProcessList();
    }

    async nextStep() {
        const result = await this.processExecutor.nextStep();

        if (result.success) {
            await this.renderCurrentState();
            this.chatbot.updateContext(
                this.processExecutor.currentProcess,
                this.processExecutor.getCurrentStep()
            );
        } else if (result.errors) {
            // Re-render current state with validation errors
            await this.renderCurrentState(result.errors);
            // Scroll to first error
            const firstError = document.querySelector('.form-group.error, .checklist-item.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }

    async previousStep() {
        const success = await this.processExecutor.previousStep();

        if (success) {
            await this.renderCurrentState();
            this.chatbot.updateContext(
                this.processExecutor.currentProcess,
                this.processExecutor.getCurrentStep()
            );
        }
    }

    async exportProcess() {
        try {
            const fileName = await this.processExecutor.exportToZip();
            alert(`프로세스가 성공적으로 내보내졌습니다: ${fileName}`);
        } catch (error) {
            console.error('내보내기 오류:', error);
            alert('프로세스를 내보내는 중 오류가 발생했습니다: ' + error.message);
        }
    }
}

window.app = new App();
window.fileHandler = null;

window.addEventListener('DOMContentLoaded', async () => {
    await window.app.init();
    window.fileHandler = window.app.fileHandler;
});
