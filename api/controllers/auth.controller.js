import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashPassword });

  try {
    await newUser.save();
    res.status(201).json("user create successfully ...");
  } catch (err) {
    next(err);
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return errorHandler("402", "User not found..");
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return errorHandler("401", "Wrong Password..");
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_KEY);
    const {password:pass, ...rest} = validUser._doc;//rename property
    

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error)
  }
};
