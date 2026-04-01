import { Request, Response, Router } from "express";
import productRoutes from "./product.routes.js";
import { shouldBeUser } from "../middleware/auth.middleware.js";

const rootRouter: Router = Router();

// product routes
rootRouter.use("/products", productRoutes);

/**
 * @openapi
 * /protected:
 *   get:
 *     summary: Protected route example
 *     responses:
 *       200:
 *         description: Returns user info
 *       401:
 *         description: Unauthorized
 */
rootRouter.get(
  "/protected",
  shouldBeUser,
  async (req: Request, res: Response) => {
    try {
      res.json({
        message: "Product service authenticated",
        userId: req.userId,
      });
    } catch (error) {
      console.error("Error in /protected:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     responses:
 *       200:
 *         description: Service is healthy
 */
rootRouter.get("/health", (req: Request, res: Response) => {
  return res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

export default rootRouter;
