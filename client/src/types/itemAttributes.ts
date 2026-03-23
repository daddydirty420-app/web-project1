export type BodyCategory =
    | "top"
    | "bottom"
    | "outer"
    | "onepiece"
    | "footwear"
    | "headwear"
    | "accessory"
    | "bag"
    | "underwear"
    | "setup"
    | "other";

export type LifeStyleCategory =
    | "casual"
    | "formal"
    | "business"
    | "active"
    | "roomwear"
    | "event"
    | "traditional"
    | "school"
    | "other";

export type Layer =
    | "inner"
    | "middle"
    | "outer"
    | "shell";

export type Fit =
    | "slim"
    | "regular"
    | "wide"
    | "oversized";

export type ItemAttributes = {
    inventory?: {
        initial: number;
        current: number;
        low_stock_ratio: number;
    }; // 在庫

    colorVariants?: Array<{
        uiId?: string;
        color?: string;
        image_url?: string;
        inventory?: {
            initial: number;
            current: number;
            low_stock_ratio: number;
        };
        
        sizes?: Array<{
            size: string;
            inventory: {
                initial: number;
                current: number;
                low_stock_ratio: number;
            };
        }>;
    }>;

    body_category?: BodyCategory;
    lifestyle_category?: LifeStyleCategory;
    layer?: Layer;
    fit?: Fit;
    materials?: Array<{
        name?: string;
        ratio?: number;
    }>; // 素材表記
};