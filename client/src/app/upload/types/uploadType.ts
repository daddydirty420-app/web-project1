import { UploadMeta } from "../hooks/useUpload";

export type Body = {
    video?: UploadMeta;
    thumbnail?: UploadMeta;
    videoMeta: { title: string; summary: string };
    itemImages: UploadMeta[];
    itemMeta: { name: string; detail: string };
    category: { id: string | null; name: string; parent_id: number | null; level: number };
    genderAge: { gender: string | null; age: string | null };
    brand: { id: string | null; name: string | null };
    attributes: {
        allInventory: number;
        colorVariants: Array<{
            uiId: string;
            color: string | null;
            image: UploadMeta | null;
            sizes: Array<{
                size: string | null;
                inventory: number;
            }>;
        }>;
        materials: Array<{
            name: string;
            ratio: number;
        }>;
    };
    condition: { id: string; name: string };
    shipping: {
        day: string | null;
        service: string | null;
        place: string | null;
        freeText: string | null;
    };
    price: string;
};
