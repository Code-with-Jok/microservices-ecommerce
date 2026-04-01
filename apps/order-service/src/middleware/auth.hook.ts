import { getAuth } from "@clerk/fastify";
import { FastifyRequest, FastifyReply } from "fastify";

// Mở rộng kiểu dữ liệu FastifyRequest để hỗ trợ userId
declare module "fastify" {
  interface FastifyRequest {
    userId?: string | null;
  }
}

export const shouldBeUser = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { isAuthenticated, userId } = getAuth(request);

  if (!isAuthenticated || !userId) {
    return reply.code(401).send({
      error: "Unauthorized",
      message: "User not authenticated",
    });
  }

  request.userId = userId;
};
