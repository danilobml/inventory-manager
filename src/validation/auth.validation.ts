import { z } from "zod";

export const authSchema = z.object({
    email: z.string().min(1).email("not a valid e-mail"),
    password: z.string().min(6, "must have at least 6 characters")
})
