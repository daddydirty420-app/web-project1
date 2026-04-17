import sequelize from "../../db.js";
import { AppError } from "../../errors.js";
import { getItem, updatePrice } from "../../services/items/index.js";
import { getSale, updateSaleEdit } from "../../services/sale.js";

type Params = {
    saleId: number;
};

export const saleStopUseCase = async ({ saleId }: Params) => {
    const sale = await getSale({ saleId });

    if (!sale) throw new AppError("SALE_NOT_FOUND", 404);

    const beforePrice = sale.before_price;

    if (!beforePrice || isNaN(beforePrice)) {
        throw new AppError("BEFORE_PRICE_INVALID", 400);
    }

    const item = await getItem({ itemId: sale.item_id });

    if (!item) throw new AppError("ITEM_NOT_FOUND", 404);

    await sequelize.transaction(async (t) => {
        await updateSaleEdit({
            sale,
            data: {
                discount_rate: 0,
                discount_amount: 0,
                sale_flag: false,
            },
            transaction: t,
        });

        await updatePrice({
            item,
            data: {
                price: beforePrice,
            },
            transaction: t,
        });
    });
};
