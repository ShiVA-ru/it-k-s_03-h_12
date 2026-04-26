import type { NextFunction, Request, Response } from "express";

export const deviceMetaMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  req.deviceMeta = {
    userAgent: req.headers["user-agent"] ?? "unknown",
    ip: req.ip ?? "",
  };

  next();
};
