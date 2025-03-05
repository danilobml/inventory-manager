import express from "express";
import dotenv from "dotenv"
import helmet from "helmet";
import cors from "cors";
import hpp from "hpp";
import morgan from "morgan";
import bodyParser from "body-parser";

// Origins for CORS (in env):
import corsOptions from "./config/cors-options.config";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware:
app.use(helmet())
app.use(cors(corsOptions));
app.use(hpp());
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`[server]: Server is running and listening at port: ${PORT}`);
})
