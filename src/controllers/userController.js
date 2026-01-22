import AppError from '../utlis/AppError.js';
import catchAsync from '../utlis/catchAsync.js';

export const getUser = catchAsync(async (req, res, next) => {
  const user = null; // simulate failure

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

export default { getUser };
