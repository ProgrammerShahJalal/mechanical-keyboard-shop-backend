import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import * as userService from './user.service';
import { IUser } from './user.interface';

const signUp = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body as IUser;

  const result = await userService.createUser({
    name,
    email,
    password,
    role,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User registered successfully',
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await userService.loginUser({ email, password });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User logged in successfully',
    data: result.user,
    token: result.token,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  // Assuming we are handling sessions or token invalidation here
  // For example, if using JWT, we can just send a success response since token invalidation is client-side
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User logged out successfully',
    data: null,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: users,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.id);

  if (!user) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'User not found',
      data: null,
    });
    return;
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: user,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.updateUser(req.params.id, req.body);

  if (!user) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'User not found',
      data: null,
    });
    return;
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: user,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.deleteUser(req.params.id);

  if (!user) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'User not found',
      data: null,
    });
    return;
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: user,
  });
});

export const UserController = {
  signUp,
  login,
  logout,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
