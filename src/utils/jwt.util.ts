import * as jwt from "jsonwebtoken"

import { JWT_SECRET } from "./constants.util";

export function generateJwt(userId: string): string {
    try {
        const token = jwt.sign({
            userId
        }, JWT_SECRET!)
        return token;
    } catch (error) {
        console.error("Error generating token:", error);
        throw error;
    }
}
