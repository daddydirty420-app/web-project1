import { BrandAliases, Brands } from "../../../../../models/index.js";
import { Body } from "../../../../../types/items/uploadBody.js";
import { toNullableNumber } from "../../utils/toNullableNumber.js";
import findOrCreateBrand from "../../../../findOrCreateBrand.js";

type Params = {
    body: Body;
};

export type BrandResult = {
    brand: InstanceType<typeof Brands> | null;
    alias: InstanceType<typeof BrandAliases> | null;
};

export const checkBrands = async ({ body }: Params) => {
    const brand = body.brand;

    // ブランドチェック
    const brandId = toNullableNumber(brand.id);

    let brandResult: BrandResult = { brand: null, alias: null };

    if (brandId !== null) {
        const selectedBrand = await Brands.findByPk(brandId);
        brandResult = { brand: selectedBrand, alias: null };
    }

    if (!brandResult.brand && brand.name) {
        brandResult = await findOrCreateBrand(brand.name ?? "");
    }

    return brandResult;
};