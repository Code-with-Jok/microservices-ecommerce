import cors from "cors";
import express, { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { clerkMiddleware } from "@clerk/express";

import { swaggerDocs } from "./config/swagger.js";
import { errorHandler } from "./middleware/error.middleware.js";
import rootRouter from "./routes/index.js";

const app: Express = express();

// Global Middlewares
app.use(
  cors({
    origin: "*",
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
