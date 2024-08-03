import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";

export const test = (req, res) => {
  res.json({
    message: "In the name of Allah",
  });
};

export const userUpdate = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(403, "You can update your own account only ...."));

  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const userUpdate = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = userUpdate._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
