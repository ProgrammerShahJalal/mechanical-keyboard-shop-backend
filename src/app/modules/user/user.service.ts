import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { User } from './user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { IUser } from './user.interface';

export const createUser = async (userData: IUser) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Check if email already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError(httpStatus.CONFLICT, 'Email already exists');
    }

    // Create new user
    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    await session.commitTransaction();
    await session.endSession();

    return newUser[0];
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, err.message);
  }
};

export const getAllUsers = async (): Promise<IUser[]> => {
  return await User.find();
};

export const getUserById = async (userId: string): Promise<IUser | null> => {
  return await User.findById(userId);
};

export const updateUser = async (
  userId: string,
  updateData: Partial<IUser>
): Promise<IUser | null> => {
  return await User.findByIdAndUpdate(userId, updateData, { new: true });
};

export const deleteUser = async (userId: string): Promise<IUser | null> => {
  return await User.findByIdAndDelete(userId);
};

export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    config.jwt_access_secret as string,
    { expiresIn: config.jwt_access_expires_in }
  );

  return { user, token };
};
