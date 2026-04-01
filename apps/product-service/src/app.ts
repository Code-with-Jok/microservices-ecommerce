import cors from "cors";
import express, { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { clerkMiddleware } from "@clerk/express";

import { swaggerDocs } from "./config/swagger.js";
import { errorHandler } from "./middleware/error.middleware.js";
import rootRouter from "./routes/index.js";

const app: Express = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:3000",
  "http://localhost:8000",
  "http://localhost:8001",
  "http://localhost:8002",
];

// Global Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(clerkMiddleware());

// Swagger Documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Health Check & Product Routes
app.use("/api/v1", rootRouter);

// Centralized Error Handling
app.use(errorHandler);

export default app;
