import { getAuth } from "@clerk/express";
import { NextFunction, Request, Response } from "express";

// Mở rộng interface Request của Express
declare global {
  namespace Express {
    interface Request {
      userId?: string | null;
    }
  }
}

export const shouldBeUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = getAuth(req);

  const userId = auth.userId;

  if (!userId) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "User not authenticated",
    });
  }

  req.userId = userId;

  return next();
};
