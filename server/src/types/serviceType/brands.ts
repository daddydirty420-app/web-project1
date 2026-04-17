import { BrandAliases, Brands } from '../../models/index.js';

export type BrandIdParams = {
    brandId: number;
};

export type NormalizedParams = {
    normalized: string;
};

export type GetAllBrandsParams = {
    keyword: string;
};

export type BrandResult = {
    brand: InstanceType<typeof Brands> | null;
    alias: InstanceType<typeof BrandAliases> | null;
};

export type FindCreateParams = {
    inputName: string;
};
