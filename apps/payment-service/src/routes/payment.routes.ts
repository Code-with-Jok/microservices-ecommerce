import { Hono } from "hono";
import { shouldBeUser } from "../middleware/auth.middleware.js";

// Hono Router
const payment = new Hono<{ Variables: { userId: string } }>();

// Public Route: Health Check
payment.get("/health", (c) => {
  return c.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

// Private Route: Protected Endpoint
payment.get("/protected", shouldBeUser, (c) => {
  const userId = c.get("userId");

  return c.json({
    message: "Payment service authenticated",
    userId,
  });
});

export default payment;
