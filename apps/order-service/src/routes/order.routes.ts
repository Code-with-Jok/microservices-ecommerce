import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { clerkClient } from "@clerk/fastify";
import { shouldBeUser } from "../middleware/auth.hook.js";

const orderRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Public Route: Health Check
  fastify.get(
    "/health",
    {
      schema: {
        description: "Get service health status",
        tags: ["health"],
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              status: { type: "string" },
              uptime: { type: "number" },
              timestamp: { type: "number" },
            },
          },
        },
      },
    },
    async () => {
      return {
        status: "ok",
        uptime: process.uptime(),
        timestamp: Date.now(),
      };
    }
  );

  // Private Route: Protected Endpoint
  fastify.get(
    "/protected",
    {
      schema: {
        description: "Protected order endpoint",
        tags: ["auth"],
        response: {
          200: {
            description: "Authenticated successfully",
            type: "object",
            properties: {
              message: { type: "string" },
              user: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  firstName: { type: "string", nullable: true },
                  lastName: { type: "string", nullable: true },
                  emailAddress: { type: "string", nullable: true },
                  profileImageUrl: { type: "string", nullable: true },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
          500: {
            description: "Internal Server Error",
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
      preHandler: [shouldBeUser],
    },
    async (request, reply) => {
      try {
        const { userId } = request;

        const user = await clerkClient.users.getUser(userId!);

        const userDTO = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          emailAddress: user.emailAddresses[0]?.emailAddress,
          profileImageUrl: user.imageUrl,
        };

        return {
          message: "Order service authenticated",
          user: userDTO,
        };
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({ error: "Failed to retrieve user" });
      }
    }
  );
};

export default orderRoutes;
