import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export type ValidationMiddleware = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => void;

export const validateRequest: ValidationMiddleware = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const formattedErrors = error.errors.map(err => {
                return `[Request validation] ${err.path.join(".")} ${err.message}`;
            });

            return res.status(400).json({ errors: formattedErrors });
        }
        next(error);
    }
};
