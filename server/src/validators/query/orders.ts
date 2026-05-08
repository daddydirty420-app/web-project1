import z from "zod";

const orderListTypes = ["purchased", "sold"] as const;

export type OrderListType = (typeof orderListTypes)[number];

export const getOrderListQuerySchema = z.object({
    type: z.enum(orderListTypes),
    page: z.coerce.number().int().positive().default(1),
    status: z.string().optional(),
});

export type OrderListQuery = z.infer<typeof getOrderListQuerySchema>;
