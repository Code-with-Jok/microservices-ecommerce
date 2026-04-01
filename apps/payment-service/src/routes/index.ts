import { Hono } from "hono";
import { shouldBeUser } from "../middleware/auth.middleware.js";

const rootRouter = new Hono<{ Variables: { userId: string } }>();

// Public Route: Health Check
rootRouter.get("/health", (c) => {
  return c.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

// Private Route: Protected Endpoint
rootRouter.get("/protected", shouldBeUser, (c) => {
  const userId = c.get("userId");

  return c.json({
    message: "Payment service authenticated",
    userId,
  });
});

export default rootRouter;
