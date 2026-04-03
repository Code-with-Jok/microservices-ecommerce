import { FastifyReply, FastifyRequest } from "fastify";
import { clerkClient } from "@clerk/fastify";
import { Order, OrderSchemaType } from "@repo/order-db";
import { startOfMonth, subMonths } from "date-fns";
import { OrderChartType } from "../types";

export const getHealthHandler = async (
  _request: FastifyRequest,
  _reply: FastifyReply
) => {
  return {
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  };
};

export const getProtectedOrderHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { userId } = request;

    if (!userId) {
      return reply
        .code(401)
        .send({ error: "Unauthorized", message: "User not found in request" });
    }

    const user = await clerkClient.users.getUser(userId);

    const userDTO = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddresses[0]?.emailAddress,
      profileImageUrl: user.imageUrl,
    };

    return reply.code(200).send({
      message: "Order service authenticated",
      user: userDTO,
    });
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: "Failed to retrieve user" });
  }
};

export const getUserOrderHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { userId } = request;

    const orders = await Order.find({ userId });

    return reply.code(200).send({
      message: "User orders retrieved successfully",
      orders,
    });
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: "Failed to retrieve user orders" });
  }
};

export const createOrderHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { userId } = request;
    if (!userId) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    const { status: _status, ...restOfOrderData } =
      request.body as OrderSchemaType;

    const newOrder = new Order({
      ...restOfOrderData,
      userId,
      status: "success",
    });

    await newOrder.save();

    return reply.code(201).send({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: "Failed to create order" });
  }
};

export const getOrdersHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { limit } = request.query as { limit: number };
    const orders = await Order.find().limit(limit).sort({ createdAt: -1 });

    return reply.code(200).send({
      message: "Latest orders retrieved successfully",
      orders,
    });
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: "Failed to retrieve latest orders" });
  }
};

export const getOrderChartHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1)
    );

    const raw = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo, $lte: now },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: 1 },
          successful: {
            $sum: {
              $cond: [{ $eq: ["$status", "success"] }, 1, 0],
              // {
              //   "year":2025,
              //   "month":9,
              //   "total":100,
              //   "successful":72
              // }
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          total: 1,
          successful: 1,
        },
      },
      {
        $sort: { year: 1, month: 1 },
      },
    ]);

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const results: OrderChartType[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1)
      );
      const year = d.getUTCFullYear();
      const month = d.getUTCMonth() + 1;

      const match = raw.find(
        (item) => item.year === year && item.month === month
      );

      results.push({
        month: monthNames[month - 1] as string,
        total: match ? match.total : 0,
        successful: match ? match.successful : 0,
      });
    }

    return reply.code(200).send({
      message: "Order chart retrieved successfully",
      sixMonthsAgo,
      results,
    });
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: "Failed to retrieve order chart" });
  }
};
