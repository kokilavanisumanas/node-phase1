import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
import { generateToken } from '../utlis/jwt.js';

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

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
