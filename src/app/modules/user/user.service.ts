import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/appError';
// import { IImageFile } from '../../interface/IImageFile'
import { IJwtPayload } from '../auth/auth.interface';
import { AuthService } from '../auth/auth.service';
// import Customer from '../customer/customer.model'
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { UserSearchableFields } from './user.constant';
import { IUser, UserRole } from './user.interface';
import User from './user.model';

// Function to register user
const registerUser = async (userData: IUser) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if ([UserRole.ADMIN].includes(userData.role)) {
      throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'Invalid role. Only User is allowed.');
    }

    // Check if the user already exists by email
    const existingUser = await User.findOne({ email: userData.email }).session(session);
    if (existingUser) {
      throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'Email is already registered');
    }

    // Create the user
    const user = new User(userData);
    const createdUser = await user.save({ session });

    // const profile = new Customer({
    //   user: createdUser._id,
    // })

    // await profile.save({ session })

    await session.commitTransaction();

    return await AuthService.loginUser({
      email: createdUser.email,
      password: userData.password!,
      clientInfo: userData.clientInfo,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    session.endSession();
  }
};

const getAllUser = async (query: Record<string, unknown>) => {
  const UserQuery = new QueryBuilder(User.find(), query).search(UserSearchableFields).filter().sort().paginate().fields();

  const result = await UserQuery.modelQuery;
  const meta = await UserQuery.countTotal();
  return {
    result,
    meta,
  };
};

const myProfile = async (authUser: IJwtPayload) => {
  const isUserExists = await User.findById(authUser.userId);
  if (!isUserExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }
  if (!isUserExists.isActive) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is not active!');
  }

  //   const profile = await Customer.findOne({ user: isUserExists._id })

  return {
    ...isUserExists.toObject(),
    // profile: profile || null,
  };
};

const updateProfileIntoDB = async (payload: IUser, user: JwtPayload) => {
  try {
    const profile = await User.findById(user.userId);

    if (!profile) {
      throw new Error('Profile not found');
    }

    Object.assign(profile, payload);
    await profile.save();
  } catch (error) {
    throw error;
  }
};

const updatePasswordIntoDB = async (payload: IUser, user: JwtPayload) => {
  const userDtl = await User.findById(user.userId);

  if (!userDtl) {
    throw new AppError(404, 'User not found');
  }

  const isMatched = await bcrypt.compare(payload?.oldPassword!, userDtl?.password!);

  if (!isMatched) {
    throw new AppError(403, 'Old password does not match!');
  }

  // ✅ Hash the new password
  const hashedPassword = await bcrypt.hash(payload?.newPassword!, Number(config.bcrypt_salt_rounds));

  userDtl.password = hashedPassword;
  await userDtl.save();
};

export const UserServices = {
  registerUser,
  getAllUser,
  myProfile,
  updateProfileIntoDB,
  updatePasswordIntoDB,
};
