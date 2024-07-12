import { Response } from 'express';

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  token?: string;
  refreshToken?: string;
  data: T;
  stripeCheckoutSessionId?: string;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  const { statusCode, success, message, data: responseData } = data;
  const responseBody: Record<string, unknown> = {
    success,
    statusCode,
    message,
    data: responseData,
  };

  res.status(statusCode).json(responseBody);
};

export default sendResponse;
