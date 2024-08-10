import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";

export const test = (req, res) => {
  res.json({
    message: "In the name of Allah",
  });
};

export const userUpdate = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(403, "You can update only your own account."));
  }

  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
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

    if (!updatedUser) {
      return next(errorHandler(404, "User not found."));
    }

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const userDelete = async (req, res, next) => {
  console.log("Delete request received for user:", req.params.id);

  if (req.user.id !== req.params.id) {
    return next(errorHandler(403, "You can only delete your own account."));
  }

  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return next(errorHandler(404, "User not found."));
    }

    console.log("User deleted successfully:", deletedUser);
    res.clearCookie("access_token");
    res.status(200).json("User deleted successfully.");
  } catch (error) {
    console.error("Error deleting user:", error);
    next(error);
  }
};

export const userListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own listings."));
  }
};

export const userListDeleting = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);



    if (!listing) {
      return next(errorHandler(404, "Listing not found."));
    }

    if (req.user.id !== listing.userRef) {
      return next(errorHandler(403, "You can only delete your own listings."));
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing deleted successfully.");

  } catch (error) {
    next(error);
  }
};
export const getListingOwner = async (req, res, next) => {
  try {
    const Owner = await User.findById(req.params.id);

    const { password: pass, ...rest } = Owner._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
