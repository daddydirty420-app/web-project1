import sequelize from '../../db.js';
import { AppError } from '../../errors.js';
import { getItem, updatePrice } from '../../services/items/index.js';
import { getSale, updateSaleEdit } from '../../services/sale.js';

type Params = {
    saleId: number;
    discountRate: number;
    discountAmount: number;
    finalPrice: number;
};

export const saleEditUseCase = async ({ saleId, discountRate, discountAmount, finalPrice }: Params) => {
    const sale = await getSale({ saleId });

    if (!sale) throw new AppError('SALE_NOT_FOUND', 404);

    const item = await getItem({ itemId: sale.item_id });

    if (!item) throw new AppError('ITEM_NOT_FOUND', 404);

    await sequelize.transaction(async (t) => {
        await updateSaleEdit({
            sale,
            data: {
                discount_rate: discountRate,
                discount_amount: discountAmount,
                sale_flag: true,
            },
            transaction: t,
        });

        await updatePrice({
            item,
            data: {
                price: finalPrice,
            },
            transaction: t,
        });
    });
};
