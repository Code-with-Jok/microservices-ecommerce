import { FastifyInstance, FastifyPluginAsync } from "fastify";
import orderRoutes from "./order.routes.js";

const rootRouter: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Gom các router con vào đây
  // Sử dụng / làm tiền tố, có thể đổi thành /orders nếu cần
  await fastify.register(orderRoutes, { prefix: "/" });
};

export default rootRouter;
