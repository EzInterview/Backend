import User from '../models/userModel.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateOTP, sendOTPEmail } from '../utils/otpHandler.js';
import { errorHandler } from '../utils/error.js';

const OTP_EXPIRATION_TIME = 5 * 60 * 1000; 

async function deleteUsersWithExpiredOTP() {
  try {
      const currentTime = Date.now();
      await User.deleteMany({
          'otp.expirationTime': { $lte: currentTime },
          'otp.code': { $ne: null }, 
      });
  } catch (error) {
      console.error('Error deleting users with expired OTP:', error);
  }
}

setInterval(deleteUsersWithExpiredOTP, 60 * 1000);

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!email) return next(errorHandler(404, 'Email is required!'));
  if (!username) return next(errorHandler(404, 'Username is required!'));
  if (!password) return next(errorHandler(404, 'Password is required!'));

  const otp = generateOTP();
  
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ 
    username, 
    email, 
    password: hashedPassword,  
    otp: {
      code: otp,
      expirationTime: Date.now() + OTP_EXPIRATION_TIME,
    }, 
  });
  
  try {
    await newUser.save();
    
    await sendOTPEmail(email, otp);
    res.status(201).json('User created successfully! Please check your email for OTP verification.');
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (req, res, next) => {
  const { email, otp } = req.body;
  console.log(otp);
  if (!email) return next(errorHandler(404, 'Email is required!'));
  if (!otp) return next(errorHandler(404, 'OTP is required!'));

  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) return next(errorHandler(404, 'User not found!'));
    
   
    if (!user.otp || req.body.otp !== user.otp.code) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

   
    if (Date.now() > user.otp.expirationTime) {
      return res.status(400).json({ error: 'OTP has expired' });
    }

   
    user.otp.code = null;
    user.otp.expirationTime = null;
    await user.save();
    
    res.status(200).json('OTP verification successful. Signup complete!');
  } catch (error) {
    next(error);
  }
};


export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email) return next(errorHandler(404, 'Email is required!'));
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};