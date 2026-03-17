export type ItemListType =
    | "cart"
    | "deleted"
    | "draft"
    | "like"
    | "stock"
    | "uploaded"
    | "recommend"
    | "watchHistory";

type ItemListMeta = {
    requireAuth: boolean;
};

export const itemListConfig: Record<ItemListType, ItemListMeta> = {
    draft: { requireAuth: true },
    cart: { requireAuth: true },
    watchHistory: { requireAuth: true },
    deleted: { requireAuth: true },
    like: { requireAuth: true },
    stock: { requireAuth: true },
    uploaded: { requireAuth: true },
    recommend: { requireAuth: false },
};