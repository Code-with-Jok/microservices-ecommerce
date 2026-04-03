import { FastifyInstance, FastifyPluginAsync } from "fastify";
import orderRoutes from "./order.routes.js";

const rootRouter: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  await fastify.register(orderRoutes);
};

export default rootRouter;
