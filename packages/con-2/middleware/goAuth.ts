import type { Request, Response, NextFunction } from "express";

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL!;

export async function GoAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "missing Authorization header" });
    }

    const response = await fetch(`${AUTH_SERVICE_URL}/check`, {
      method: "POST",
      headers: {
        Authorization: authHeader, // pass THROUGH, no modification
      },
    });

    if (!response.ok) {
      return res.status(401).json({ message: "invalid token" });
    }

    next();
  } catch (err) {
    console.error("Auth sidecar error:", err);
    return res.status(500).json({ message: "auth service unavailable" });
  }
}
