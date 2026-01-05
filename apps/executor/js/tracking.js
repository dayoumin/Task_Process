class TrackingLogger {
    constructor(dbManager) {
        this.db = dbManager;
    }

    async logProcessStart(processId, processName) {
        return await this.db.addLog({
            processId,
            action: 'PROCESS_STARTED',
            details: `프로세스 "${processName}" 시작`,
            metadata: {
                startTime: new Date().toISOString()
            }
        });
    }

    async logStepStart(processId, stepId, stepTitle) {
        return await this.db.addLog({
            processId,
            action: 'STEP_STARTED',
            details: `단계 "${stepTitle}" 시작`,
            metadata: {
                stepId,
                startTime: new Date().toISOString()
            }
        });
    }

    async logStepComplete(processId, stepId, stepTitle, duration) {
        return await this.db.addLog({
            processId,
            action: 'STEP_COMPLETED',
            details: `단계 "${stepTitle}" 완료`,
            metadata: {
                stepId,
                completedAt: new Date().toISOString(),
                duration
            }
        });
    }

    async logProcessComplete(processId, processName, totalDuration) {
        return await this.db.addLog({
            processId,
            action: 'PROCESS_COMPLETED',
            details: `프로세스 "${processName}" 완료`,
            metadata: {
                completedAt: new Date().toISOString(),
                totalDuration
            }
        });
    }

    async logFieldUpdate(processId, fieldId, fieldLabel, value) {
        return await this.db.addLog({
            processId,
            action: 'FIELD_UPDATED',
            details: `필드 "${fieldLabel}" 업데이트`,
            metadata: {
                fieldId,
                value: typeof value === 'object' ? '[파일]' : value
            }
        });
    }

    async logFileUpload(processId, fieldId, fileName, fileSize) {
        return await this.db.addLog({
            processId,
            action: 'FILE_UPLOADED',
            details: `파일 "${fileName}" 업로드`,
            metadata: {
                fieldId,
                fileName,
                fileSize
            }
        });
    }

    async createDeadlineNotification(processId, processName, dueDate) {
        const now = new Date();
        const due = new Date(dueDate);
        const hoursUntilDue = (due - now) / (1000 * 60 * 60);

        if (hoursUntilDue < 0) {
            return await this.db.addNotification({
                processId,
                type: 'DEADLINE_OVERDUE',
                title: '마감일 초과',
                message: `"${processName}" 프로세스의 마감일이 지났습니다.`,
                priority: 'high'
            });
        } else if (hoursUntilDue < 24) {
            return await this.db.addNotification({
                processId,
                type: 'DEADLINE_URGENT',
                title: '마감일 임박',
                message: `"${processName}" 프로세스가 24시간 내에 마감됩니다.`,
                priority: 'high'
            });
        } else if (hoursUntilDue < 48) {
            return await this.db.addNotification({
                processId,
                type: 'DEADLINE_WARNING',
                title: '마감일 알림',
                message: `"${processName}" 프로세스가 48시간 내에 마감됩니다.`,
                priority: 'medium'
            });
        }

        return null;
    }

    calculateProgress(process, progress) {
        if (!progress || !progress.completedSteps) {
            return 0;
        }

        const totalSteps = process.steps.length;
        const completedCount = progress.completedSteps.length;

        return Math.round((completedCount / totalSteps) * 100);
    }

    calculateTimeRemaining(tracking, progress) {
        if (!tracking || !tracking.estimatedHours) {
            return null;
        }

        const totalMinutes = tracking.estimatedHours * 60;
        const completedSteps = progress?.completedSteps?.length || 0;
        const totalSteps = progress?.totalSteps || 1;

        const progressPercent = completedSteps / totalSteps;
        const estimatedUsedMinutes = totalMinutes * progressPercent;
        const remainingMinutes = Math.max(0, totalMinutes - estimatedUsedMinutes);

        return {
            hours: Math.floor(remainingMinutes / 60),
            minutes: Math.round(remainingMinutes % 60),
            total: remainingMinutes
        };
    }

    getDeadlineStatus(dueDate) {
        if (!dueDate) return null;

        const now = new Date();
        const due = new Date(dueDate);
        const hoursUntilDue = (due - now) / (1000 * 60 * 60);

        if (hoursUntilDue < 0) {
            return { status: 'overdue', label: '마감일 초과', class: 'deadline-urgent' };
        } else if (hoursUntilDue < 24) {
            return { status: 'urgent', label: '24시간 내 마감', class: 'deadline-urgent' };
        } else if (hoursUntilDue < 48) {
            return { status: 'warning', label: '48시간 내 마감', class: 'deadline-warning' };
        } else {
            const days = Math.ceil(hoursUntilDue / 24);
            return { status: 'normal', label: `${days}일 남음`, class: '' };
        }
    }

    getStatusLabel(progress) {
        if (!progress || !progress.status) {
            return { status: 'not-started', label: '시작 안 함', class: 'status-not-started' };
        }

        switch (progress.status) {
            case 'in-progress':
                return { status: 'in-progress', label: '진행 중', class: 'status-in-progress' };
            case 'completed':
                return { status: 'completed', label: '완료', class: 'status-completed' };
            default:
                return { status: 'not-started', label: '시작 안 함', class: 'status-not-started' };
        }
    }

    formatDuration(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}시간 ${minutes % 60}분`;
        } else if (minutes > 0) {
            return `${minutes}분`;
        } else {
            return `${seconds}초`;
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 1) return '방금 전';
        if (diffMins < 60) return `${diffMins}분 전`;
        if (diffHours < 24) return `${diffHours}시간 전`;
        if (diffDays < 7) return `${diffDays}일 전`;

        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}
