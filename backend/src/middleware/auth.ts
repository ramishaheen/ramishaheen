import { Request, Response, NextFunction } from "express";

const ADMIN_TOKEN_HEADER = "x-mythos-admin-token";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.header(ADMIN_TOKEN_HEADER);
  if (!token || token !== process.env.JWT_SECRET) {
    return res.status(403).json({ message: "Admin privileges required." });
  }
  next();
}
