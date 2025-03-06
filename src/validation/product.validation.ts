import { z } from "zod";

export const createUpdateProductSchema = z.object({
    name: z.string().min(1, "must have at least one character."),
    price: z.number().positive("must be greater than 0.")
});

export const buySellProductSchema = z.object({
    amount: z.number().int().positive("must be positive and integer.")
})