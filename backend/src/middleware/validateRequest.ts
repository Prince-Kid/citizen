import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import { logger } from "../utils/logger";

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("Validating request body:", req.body);
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      logger.error("Validation error:", error);
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors || error.message,
      });
    }
  };
};
