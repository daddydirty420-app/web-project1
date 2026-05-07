import { z } from "zod";

const itemPageModes = ["normal", "draft", "confirm", "deleted"] as const;

export type ItemPageMode = (typeof itemPageModes)[number];

export const getItemPageQuerySchema = z.object({
    mode: z.enum(itemPageModes).optional(),
});
