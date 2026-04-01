import { Hono } from "hono";
import paymentRoutes from "./payment.routes.js";

const rootRouter = new Hono<{ Variables: { userId: string } }>();

// Mount Payment Routes
rootRouter.route("/", paymentRoutes);

export default rootRouter;
