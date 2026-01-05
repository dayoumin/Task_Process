class IndexedDBManager {
    constructor() {
        this.dbName = 'ProcessExecutorDB';
        this.version = 1;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // 1. processes: 프로세스 템플릿
                if (!db.objectStoreNames.contains('processes')) {
                    const processStore = db.createObjectStore('processes', { keyPath: 'id' });
                    processStore.createIndex('name', 'name', { unique: false });
                    processStore.createIndex('createdAt', 'createdAt', { unique: false });
                }

                // 2. progresses: 진행 상황
                if (!db.objectStoreNames.contains('progresses')) {
                    const progressStore = db.createObjectStore('progresses', { keyPath: 'processId' });
                    progressStore.createIndex('status', 'status', { unique: false });
                    progressStore.createIndex('updatedAt', 'updatedAt', { unique: false });
                }

                // 3. files: 첨부 파일 (Blob)
                if (!db.objectStoreNames.contains('files')) {
                    const fileStore = db.createObjectStore('files', { keyPath: 'id', autoIncrement: true });
                    fileStore.createIndex('processId', 'processId', { unique: false });
                    fileStore.createIndex('fieldId', 'fieldId', { unique: false });
                }

                // 4. logs: 변경 이력
                if (!db.objectStoreNames.contains('logs')) {
                    const logStore = db.createObjectStore('logs', { keyPath: 'id', autoIncrement: true });
                    logStore.createIndex('processId', 'processId', { unique: false });
                    logStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                // 5. notifications: 알림
                if (!db.objectStoreNames.contains('notifications')) {
                    const notificationStore = db.createObjectStore('notifications', { keyPath: 'id', autoIncrement: true });
                    notificationStore.createIndex('processId', 'processId', { unique: false });
                    notificationStore.createIndex('createdAt', 'createdAt', { unique: false });
                    notificationStore.createIndex('read', 'read', { unique: false });
                }
            };
        });
    }

    async addProcess(process) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['processes'], 'readwrite');
            const store = tx.objectStore('processes');

            const processWithMeta = {
                ...process,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const request = store.put(processWithMeta);
            request.onsuccess = () => resolve(processWithMeta);
            request.onerror = () => reject(request.error);
        });
    }

    async getProcess(id) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['processes'], 'readonly');
            const store = tx.objectStore('processes');
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllProcesses() {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['processes'], 'readonly');
            const store = tx.objectStore('processes');
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async saveProgress(progress) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['progresses'], 'readwrite');
            const store = tx.objectStore('progresses');

            const progressWithMeta = {
                ...progress,
                updatedAt: new Date().toISOString()
            };

            const request = store.put(progressWithMeta);
            request.onsuccess = () => resolve(progressWithMeta);
            request.onerror = () => reject(request.error);
        });
    }

    async getProgress(processId) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['progresses'], 'readonly');
            const store = tx.objectStore('progresses');
            const request = store.get(processId);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async saveFile(processId, fieldId, file) {
        return new Promise((resolve, reject) => {
            try {
                const tx = this.db.transaction(['files'], 'readwrite');
                const store = tx.objectStore('files');

                const fileData = {
                    processId,
                    fieldId,
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    blob: file,
                    createdAt: new Date().toISOString()
                };

                const request = store.add(fileData);
                request.onsuccess = () => resolve({ id: request.result, ...fileData });
                request.onerror = () => {
                    if (request.error.name === 'QuotaExceededError') {
                        reject(new Error('저장 공간이 부족합니다. 파일 크기를 줄이거나 일부 데이터를 삭제하세요.'));
                    } else {
                        reject(request.error);
                    }
                };
            } catch (error) {
                reject(error);
            }
        });
    }

    async getFile(id) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['files'], 'readonly');
            const store = tx.objectStore('files');
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getFilesByProcess(processId) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['files'], 'readonly');
            const store = tx.objectStore('files');
            const index = store.index('processId');
            const request = index.getAll(processId);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async addLog(log) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['logs'], 'readwrite');
            const store = tx.objectStore('logs');

            const logWithMeta = {
                ...log,
                timestamp: new Date().toISOString()
            };

            const request = store.add(logWithMeta);
            request.onsuccess = () => resolve({ id: request.result, ...logWithMeta });
            request.onerror = () => reject(request.error);
        });
    }

    async getLogsByProcess(processId) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['logs'], 'readonly');
            const store = tx.objectStore('logs');
            const index = store.index('processId');
            const request = index.getAll(processId);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async addNotification(notification) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['notifications'], 'readwrite');
            const store = tx.objectStore('notifications');

            const notificationWithMeta = {
                ...notification,
                createdAt: new Date().toISOString(),
                read: false
            };

            const request = store.add(notificationWithMeta);
            request.onsuccess = () => resolve({ id: request.result, ...notificationWithMeta });
            request.onerror = () => reject(request.error);
        });
    }

    async getUnreadNotifications() {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['notifications'], 'readonly');
            const store = tx.objectStore('notifications');
            const index = store.index('read');
            const request = index.getAll(false);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async markNotificationAsRead(id) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['notifications'], 'readwrite');
            const store = tx.objectStore('notifications');
            const getRequest = store.get(id);

            getRequest.onsuccess = () => {
                const notification = getRequest.result;
                if (notification) {
                    notification.read = true;
                    const putRequest = store.put(notification);
                    putRequest.onsuccess = () => resolve();
                    putRequest.onerror = () => reject(putRequest.error);
                } else {
                    resolve();
                }
            };

            getRequest.onerror = () => reject(getRequest.error);
        });
    }

    async deleteProcess(processId) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['processes', 'progresses', 'files', 'logs', 'notifications'], 'readwrite');

            tx.objectStore('processes').delete(processId);
            tx.objectStore('progresses').delete(processId);

            const fileStore = tx.objectStore('files');
            const fileIndex = fileStore.index('processId');
            const fileRequest = fileIndex.getAll(processId);

            fileRequest.onsuccess = () => {
                const files = fileRequest.result;
                for (const file of files) {
                    fileStore.delete(file.id);
                }
            };

            const logStore = tx.objectStore('logs');
            const logIndex = logStore.index('processId');
            const logRequest = logIndex.getAll(processId);

            logRequest.onsuccess = () => {
                const logs = logRequest.result;
                for (const log of logs) {
                    logStore.delete(log.id);
                }
            };

            const notificationStore = tx.objectStore('notifications');
            const notificationIndex = notificationStore.index('processId');
            const notificationRequest = notificationIndex.getAll(processId);

            notificationRequest.onsuccess = () => {
                const notifications = notificationRequest.result;
                for (const notification of notifications) {
                    notificationStore.delete(notification.id);
                }
            };

            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }
}
