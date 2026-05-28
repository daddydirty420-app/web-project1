export const NOTIFICATION_RETENTION_DAYS = {
    SHORT: 90,
    NORMAL: 180,
    IMPORTANT: 365,
    PERMANENT: null,
} as const;

export type NotificationRetentionLevel = keyof typeof NOTIFICATION_RETENTION_DAYS;
