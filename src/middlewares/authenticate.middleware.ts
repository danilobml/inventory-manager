import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

import { prisma } from "../utils/prisma.util";
import { JWT_SECRET } from "../utils/constants.util";

export type AuthenticationMiddleware = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const authenticateRoute: AuthenticationMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            next(new Error("Unauthorized"));
        }
        const payload = jwt.verify(token!, JWT_SECRET!);
        const user = prisma.user.findFirst({where: { id: payload.toString() }})
        if (!user) {
            next(new Error("Unauthorized"));
        }
        next();
    } catch (error) {
        next(new Error("Unauthorized"))
    }
}
