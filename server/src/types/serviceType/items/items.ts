import { Transaction } from "sequelize";
import { Item } from "../../../models/index.js";
import { BodyCategory, ItemAttributes, Layer, LifeStyleCategory } from "../../itemAttributes.js";

export type ItemIdParams = {
    itemId: number;
};

export type UserIdParams = {
    userId: number;
};

export type ItemListParams = {
    where: any;
    limit: number;
    offset: number;
};

export type RecommendParams = {
    where: any;
};

export type ItemPageRecommendParams = {
    where: any;
    targetParentId: number;
    categoryRequired: boolean;
};

export type ItemTransactionParams = {
    item: InstanceType<typeof Item>;
    transaction: Transaction;
};

export type SortUpdateParams = {
    item: InstanceType<typeof Item>;
    data: {
        sort_number: number;
        sort_buzz_number: number;
    };
};

export type CountUpdateParams = {
    item: InstanceType<typeof Item>;
    data: {
        views_count: number;
    };
};

export type PublishUpdateParams = {
    item: InstanceType<typeof Item>;
    data: {
        sort_number: number;
        sort_buzz_number: number;
        search_text: string;
    };
    transaction: Transaction;
};

export type UpdateItemParams = {
    item: InstanceType<typeof Item>;
    data: {
        name: string;
        detail: string;

        category_id: number | null;
        gender_type: string | null;
        age_type: string | null;
        brand_id: number | null;
        brand_aliases_id: number | null;
        item_condition_id: number | null;

        attributes: {
            inventory?: {
                initial: number,
                current: number,
                low_stock_ratio: number,
            };

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

            materials?: Array<{
                name: string;
                ratio: number;
            }>;

            body_category?: BodyCategory;
            lifestyle_category?: LifeStyleCategory;
            layer?: Layer;
        };

        price: number;
        first_image_url: string;
        status: "editing" | "draft";
    };
    transaction: Transaction;
};

export type UpdateItemImageParams = {
    item: InstanceType<typeof Item>;
    urls: string[];
    transaction: Transaction;
};

export type ItemDataParams = {
    item: InstanceType<typeof Item>;
};

export type LogicalDeleteParams = {
    item: InstanceType<typeof Item>;
    data: {
        price: number;
    };
    transaction: Transaction;
};

export type CreateItemCopyUploadParams = {
    data: {
        name: string;
        detail: string;
        price: number,
        item_condition_id: number,
        seller_id: number,
        search_text: string,
        image_url: string | string[],
        first_image_url: string,
        gender_type: string,
        age_type: string,
        category_id: number,
        brand_id: number | null,
        attributes: ItemAttributes,
    };
    transaction: Transaction;
};