import { FastifyInstance, FastifyPluginAsync } from "fastify";
import {
  healthSchema,
  protectedSchema,
  userOrderSchema,
  allOrdersSchema,
  orderChartSchema,
  createOrderSchema,
} from "../schemas/order.schema.js";
import {
  createOrderHandler,
  getHealthHandler,
  getOrderChartHandler,
  getOrdersHandler,
  getProtectedOrderHandler,
  getUserOrderHandler,
} from "../controllers/order.controller.js";
import { shouldBeUser } from "../middleware/auth.hook.js";

const orderRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  await fastify.register(healthRouter);
  await fastify.register(protectedRouter);
  await fastify.register(orderRouter);
};

/**
 * Public: Health router
 * Get /api/v1/health
 */
const healthRouter: FastifyPluginAsync = async (fastify) => {
  fastify.get("/health", { schema: healthSchema }, getHealthHandler);
};

/**
 * Private: Protected router
 * Get /api/v1/protected
 */
const protectedRouter: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    "/protected",
    {
      schema: protectedSchema,
      preHandler: [shouldBeUser],
    },
    getProtectedOrderHandler
  );
};

const orderRouter: FastifyPluginAsync = async (fastify) => {
  /**
   * Private: User order router
   * Get /api/v1/user-order
   */
  fastify.get(
    "/user-order",
    {
      schema: userOrderSchema,
      preHandler: [shouldBeUser],
    },
    getUserOrderHandler
  );

  /**
   * Private: Create a new order
   * Post /api/v1/orders/create
   */
  fastify.post(
    "/orders/create",
    {
      schema: createOrderSchema,
      preHandler: [shouldBeUser],
    },
    createOrderHandler
  );

  /**
   * Private: Get all orders
   * Get /api/v1/orders
   */
  fastify.get(
    "/orders",
    {
      schema: allOrdersSchema,
      preHandler: [shouldBeUser],
    },
    getOrdersHandler
  );

  /**
   * Private: Get order chart data
   */
  fastify.get(
    "/order-chart",
    {
      schema: orderChartSchema,
      preHandler: [shouldBeUser],
    },
    getOrderChartHandler
  );
};

export default orderRoutes;
