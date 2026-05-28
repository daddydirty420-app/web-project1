export const NOTIFICATION_RETENTION_DAYS = {
    SHORT: 60,
    NORMAL: 180,
    IMPORTANT: 365,
    PERMANENT: null,
} as const;

export type NotificationRetentionLevel = keyof typeof NOTIFICATION_RETENTION_DAYS;

export const NOTIFICATION_CONFIG = {
    LIKE: {
        retention: "SHORT",
    },
    FOLLOW: {
        retention: "SHORT",
    },
    ITEM: {
        retention: "NORMAL",
    },
    COMMENT: {
        retention: "SHORT",
    },
    COMMENT_REPLY: {
        retention: "SHORT",
    },
    ORDER_CREATED: {
        retention: "IMPORTANT",
    },
    ITEM_DELETED_BY_ADMIN: {
        retention: "PERMANENT",
    },
    COMMENT_DELETED_BY_ADMIN: {
        retention: "IMPORTANT",
    },
} as const satisfies Record<
    string,
    {
        retention: NotificationRetentionLevel;
    }
>;

export type NotificationType = keyof typeof NOTIFICATION_CONFIG;
