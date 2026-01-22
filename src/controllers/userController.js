import AppError from '../utlis/AppError.js';
import catchAsync from '../utlis/catchAsync.js';
import User from '../models/userModel.js';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

/** Get All users */
export const getUser = catchAsync(async (req, res, next) => {
  const users = await User.find({}, '-password -email').lean();

  if (!users.length) {
    return res.status(404).json({
      success: false,
      message: 'No users found'
    });
  }

  return res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});


/** Get user by ID */

export const getUserById = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  // Validate if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID format'
    });
  }

  const user = await User.findById(userId, '-password').lean();

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  return res.status(200).json({
    success: true,
    data: user
  });
});


/** Delete User Api */

export const deleteUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  // Validate if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID format'
    });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  await user.deleteOne();

  return res.status(200).json({
    success: true,
    message: "User deleted successfully"
  });
});


/** update Users  */


export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    /**
     * 1. Validate input
     */
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required',
      });
    }

    /**
     * 2. Check user exists
     */
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    /**
     * 3. Check email already used by another user
     */
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    /**
     * 4. Update fields
     */
    user.name = name;
    user.email = email;

    // Only update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    /**
     * 5. Save updated user
     */
    await user.save();

    /**
     * 6. Send response
     */
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};


export default {
   getUser,
   getUserById,
   deleteUser,
   updateUser
};
