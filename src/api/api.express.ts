
import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import hpp from "hpp";
import morgan from "morgan";
import bodyParser from "body-parser";

import { API } from "./interfaces/api";
// Origins for CORS (in env):
import corsOptions from "../config/cors-options.config";

type Handler = (req: Request, res: Response) => Promise<void>;


export class ApiExpress implements API {

    public version = "v1";

    private constructor(readonly app: Express) { }

    public static build() {
        const app = express();
        
        // Apply Middleware:
        app.use(express.json())
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(helmet())
        app.use(cors(corsOptions));
        app.use(hpp());
        app.use(morgan("combined"));

        return new ApiExpress(app);
    }

    public addGetRoute(path: string, handler: Handler): void {
        this.app.get(path, handler);
    }

    public addPostRoute(path: string, handler: Handler): void {
        this.app.post(path, handler);
    }

    public addPutRoute(path: string, handler: Handler): void {
        this.app.put(path, handler);
    }

    public addPatchRoute(path: string, handler: Handler): void {
        this.app.patch(path, handler);
    }

    public addDeleteRoute(path: string, handler: Handler): void {
        this.app.delete(path, handler);
    }

    public start(port: string | number): void {
        this.app.listen(port, () => {
            console.log(`[server]: Server is running and listening at port: ${port}`);
        })
     }
}