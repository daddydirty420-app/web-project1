export type PurchaseSnapshot = {
    item_id: number;
    item_name: string;
    item_image: string;

    category: {
        id: number;
        name: string;
    };

    brand?: {
        id?: number;
        name?: string;
    };

    variant?: {
        color?: string;
        size?: string;
        size_label?: string;
        image_url?: string;
    };

    material?: string[]; // 素材表記
};