import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';


export const  signup = async  (req, res, next) =>{
  const { username, email, password} = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10)
  const newUser = new User({
    username,
    email,
    password: hashedPassword
  });
  try {
    await newUser.save()
    res.status(201).json({message: "User created successfully"})
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) =>{
   const {email, password} = req.body;
   try {
    const validUser = await User.findOne({email});
    if (!validUser) return next(errorHandler(404, "User not found"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Unauthorized! Invalid password"));
    const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
    const { password: pass, ...rest} = validUser._doc;
    res.cookie('access_token', token, {httpOnly: true}).status(200).json({
        user: rest
    });
   } catch (error) {
    next(error);
    
   }
}; 


export const signOut = (req, res) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been successfully logged out');
  } catch (error) {
    next(error);
  }
}

export const google = async (req, res, next) =>{
 try {
   const user = await User.findOne({email: req.body.email});
   if(user){
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
    const { password, ...rest} = user._doc;
    res
    .cookie('access_token', token, {httpOnly: true})
    .status(200).json({
        user: rest
    });
   } else{
     const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
     const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
     const newUser = new User({
       username: req.body.name.split("").join("").toLowerCase() + Math.random().toString(36).slice(-4),
       email: req.body.email,
       password: hashedPassword,
       avatar: req.body.photo
     });
     await newUser.save();
     const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);
     res
     .cookie('access_token', token, {httpOnly: true})
     .status(200).json({
         user: {name: newUser.name, email: newUser.email, photo: newUser.photo}
     });
   }
 } catch (error) {
  next(error);
  
 } 
}


// Forgot password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
     await user.save({ validateBeforeSave: false });


    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const message = `Click the following link to reset your password: ${resetUrl}`;

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request',
      text: message,
    });

    res.status(200).json({ message: 'Email sent. Check your inbox.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  const resetTokenHash = crypto.createHash('sha256').update(req.params.token).digest('hex');
  try {
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(req.body.password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
