import { create } from 'zustand';
import { useCallback } from 'react';

// Tipos para notificaciones
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message?: string;
    duration?: number; // en milisegundos, 0 para persistente
    timestamp: number;
}

interface NotificationState {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
    removeNotification: (id: string) => void;
    clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],

    addNotification: (notification) => {
        const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newNotification: Notification = {
            ...notification,
            id,
            timestamp: Date.now(),
            duration: notification.duration ?? 5000, // 5 segundos por defecto
        };

        set((state) => ({
            notifications: [...state.notifications, newNotification],
        }));

        // Auto-remover después del tiempo especificado
        if (newNotification.duration && newNotification.duration > 0) {
            setTimeout(() => {
                const currentNotifications = get().notifications;
                if (currentNotifications.find(n => n.id === id)) {
                    get().removeNotification(id);
                }
            }, newNotification.duration);
        }
    },

    removeNotification: (id) => {
        set((state) => ({
            notifications: state.notifications.filter(n => n.id !== id),
        }));
    },

    clearAll: () => {
        set({ notifications: [] });
    },
}));

// Hook de conveniencia para notificaciones comunes
export const useNotifications = () => {
    const { addNotification } = useNotificationStore();

    const notifySuccess = useCallback((title: string, message?: string) =>
        addNotification({ type: 'success', title, message })
    , [addNotification]);

    const notifyError = useCallback((title: string, message?: string) =>
        addNotification({ type: 'error', title, message, duration: 8000 })
    , [addNotification]);

    const notifyWarning = useCallback((title: string, message?: string) =>
        addNotification({ type: 'warning', title, message })
    , [addNotification]);

    const notifyInfo = useCallback((title: string, message?: string) =>
        addNotification({ type: 'info', title, message })
    , [addNotification]);

    return {
        notifySuccess,
        notifyError,
        notifyWarning,
        notifyInfo,
    };
};
