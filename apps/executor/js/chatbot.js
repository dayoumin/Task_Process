class ChatbotManager {
    constructor() {
        this.panel = document.getElementById('chatbot-panel');
        this.toggle = document.getElementById('chatbot-toggle');
        this.close = document.getElementById('chatbot-close');
        this.iframe = document.getElementById('chatbot-iframe');
        this.isOpen = false;

        this.init();
    }

    init() {
        this.toggle.addEventListener('click', () => this.togglePanel());
        this.close.addEventListener('click', () => this.closePanel());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closePanel();
            }
        });

        this.panel.addEventListener('click', (e) => {
            if (e.target === this.panel) {
                this.closePanel();
            }
        });
    }

    togglePanel() {
        if (this.isOpen) {
            this.closePanel();
        } else {
            this.openPanel();
        }
    }

    openPanel() {
        this.panel.classList.add('open');
        this.isOpen = true;

        if (!this.iframe.src || this.iframe.src === '' || this.iframe.src === 'about:blank') {
            this.iframe.src = 'http://localhost:3000';
        }
    }

    closePanel() {
        this.panel.classList.remove('open');
        this.isOpen = false;
    }

    updateContext(process, currentStep) {
        const message = {
            type: 'process-context',
            data: {
                processId: process?.id,
                processName: process?.name,
                currentStep: currentStep?.title,
                stepDescription: currentStep?.description
            }
        };

        if (this.iframe.contentWindow) {
            this.iframe.contentWindow.postMessage(message, 'http://localhost:3000');
        }
    }
}
