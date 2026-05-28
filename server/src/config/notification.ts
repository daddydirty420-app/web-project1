export const NOTIFICATION_RETENTION_DAYS = {
    SHORT: 90,
    NORMAL: 180,
    IMPORTANT: 365,
    PERMANENT: null,
} as const;

export const NOTIFICATION_TYPES = {
    LIKE: "LIKE",
    FOLLOW: "FOLLOW",
    COMMENT: "COMMENT",
    COMMENT_REPLY: "COMMENT_REPLY",
    ORDER_CREATED: "ORDER_CREATED",
} as const;

export type NotificationRetentionLevel = keyof typeof NOTIFICATION_RETENTION_DAYS;
export type NotificationType = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];
