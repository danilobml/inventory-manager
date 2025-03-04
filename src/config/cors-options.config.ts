import dotenv from "dotenv";

dotenv.config();

const allowedOrigins = process.env.ALLOWED_CORS_ORIGINS?.split(",") || ["*"];

const corsOptions = {
  origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

export default corsOptions;
