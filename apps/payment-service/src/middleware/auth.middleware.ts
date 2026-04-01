import { getAuth } from "@hono/clerk-auth";
import { MiddlewareHandler } from "hono";

export const shouldBeUser: MiddlewareHandler = async (c, next) => {
  const auth = getAuth(c);
  const userId = auth?.userId;

  if (!userId) {
    return c.json(
      { error: "Unauthorized", message: "You are not logged in!" },
      401
    );
  }

  c.set("userId", userId);

  await next();
};
