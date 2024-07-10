import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import httpStatus from 'http-status';
import { UserRole } from '../modules/user/user.constant';
import { NextFunction, Request, Response } from 'express';

const auth =
  (...allowedRoles: UserRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        statusCode: httpStatus.UNAUTHORIZED,
        message: 'No token provided',
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string
      ) as JwtPayload;
      req.user = decoded;

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          success: false,
          statusCode: httpStatus.UNAUTHORIZED,
          message: 'You have no access to this route',
        });
      }

      next();
    } catch (err) {
      // Check if it's a token expiration error
      if (err instanceof jwt.TokenExpiredError) {
        // Attempt to use refresh token
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
          return res.status(httpStatus.UNAUTHORIZED).json({
            success: false,
            statusCode: httpStatus.UNAUTHORIZED,
            message: 'Refresh token not provided',
          });
        }

        try {
          const decodedRefresh = jwt.verify(
            refreshToken,
            config.jwt_refresh_secret as string
          ) as JwtPayload;
          const userId = decodedRefresh.id;

          // Generate a new access token
          const newAccessToken = jwt.sign(
            { id: userId, role: decodedRefresh.role },
            config.jwt_access_secret as string,
            {
              expiresIn: config.jwt_access_expires_in,
            }
          );

          // Set new access token in header for next middlewares
          req.headers.authorization = `Bearer ${newAccessToken}`;

          // Respond with new access token
          res.setHeader('Authorization', `Bearer ${newAccessToken}`);

          next();
        } catch (refreshErr) {
          return res.status(httpStatus.UNAUTHORIZED).json({
            success: false,
            statusCode: httpStatus.UNAUTHORIZED,
            message: 'Invalid refresh token',
          });
        }
      } else {
        return res.status(httpStatus.UNAUTHORIZED).json({
          success: false,
          statusCode: httpStatus.UNAUTHORIZED,
          message: 'Invalid token',
        });
      }
    }
  };

export default auth;
