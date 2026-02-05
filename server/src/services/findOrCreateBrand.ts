import { Brands, BrandAliases } from "../models/index.js";
import { normalizeJapanese } from "../utils/normalizeJapanese.js";

async function findOrCreateBrand(inputName: string) {
    const normalized = normalizeJapanese(inputName);

    let alias = await BrandAliases.findOne({
        where: { name_normalized: normalized },
        include: [{ model: Brands }],
    });

    if (alias?.brand) {
        return alias.brand;
    }

    let brand = await Brands.findOne({
        where: { name_normalized: normalized },
    });

    if (!brand && inputName.length >= 2) {
        brand = await Brands.create({
            name: inputName,
            name_normalized: normalized,
        });

        await BrandAliases.create({
            brand_id: brand.id,
            name: inputName,
            name_normalized: normalized,
        });
    }

    return brand;
}

export default findOrCreateBrand;