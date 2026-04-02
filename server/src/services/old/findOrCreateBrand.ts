import { Brands, BrandAliases } from "../../models/index.js";
import { normalizeJapanese } from "../../utils/normalizeJapanese.js";

async function findOrCreateBrand(inputName: string): Promise <{
    brand: InstanceType<typeof Brands> | null;
    alias: InstanceType<typeof BrandAliases> | null;
}> {
    const normalized = normalizeJapanese(inputName);

    let alias = await BrandAliases.findOne({
        where: { name_normalized: normalized },
        include: [{
            model: Brands,
            as: "brand",
        }],
    });

    if (alias?.brand) {
        return { brand: alias.brand, alias };
    }

    let brand = await Brands.findOne({
        where: { name_normalized: normalized },
    });

    if (!brand && inputName.length >= 2) {
        alias = await BrandAliases.create({
            brand_id: null,
            name: inputName,
            name_normalized: normalized,
        });
        return { brand: null, alias };
    }

    return { brand, alias: null };
}

export default findOrCreateBrand;