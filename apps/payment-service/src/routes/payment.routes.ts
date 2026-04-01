import { Hono } from "hono";

// Hono Router
const payment = new Hono<{ Variables: { userId: string } }>();

export default payment;
