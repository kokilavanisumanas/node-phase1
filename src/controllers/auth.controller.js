import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
import { generateToken } from '../utlis/jwt.js';
import catchAsync from '../utlis/catchAsync.js';

export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  /**
   * 1. Validate input
   */
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }

  /**
   * 2. Check duplicate email
   */
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'Email already registered',
    });
  }

  /**
   * 3. Hash password
   */
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  /**
   * 4. Create user
   */
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || 'user',
  });

  /**
   * 5. Generate JWT
   */
  const token = generateToken(user._id);

  /**
   * 6. Send response
   */
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};


export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // 1️⃣ Check input
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  // 2️⃣ Find user (include password explicitly)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // 3️⃣ Compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // 4️⃣ Generate token
  const token = generateToken(user._id);

  return res.status(200).json({
    success: true,
    token,
  });
});
