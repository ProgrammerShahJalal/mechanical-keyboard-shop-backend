import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import sendResponse from "./sendResponse";
import AppError from "../errors/AppError";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

const catchAsync =
  (fn: AsyncRequestHandler) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch((error) => {
      if (
        error instanceof AppError &&
        error.statusCode === httpStatus.NOT_FOUND
      ) {
        return sendResponse(res, {
          statusCode: httpStatus.NOT_FOUND,
          success: false,
          message: "Not Found",
          data: [],
        });
      }
      next(error);
    });

export default catchAsync;
