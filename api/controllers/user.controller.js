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

export const userDelete = async (req, res, next) => {
  console.log('Delete request received for user:', req.params.id);
  
  if (req.user.id !== req.params.id) {
    return next(new Error("You can only delete your own account."));
  }
  
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    
    if (!deletedUser) {
      return next(new Error("User not found."));
    }

    console.log('User deleted successfully:', deletedUser);
    res.clearCookie('access_token');
    res.status(200).json("User deleted successfully.")
  } catch (error) {
    console.error('Error deleting user:', error);
    next(error);
  }
};

export const userListings = async (req,res,next) =>{
    
   if(req.user.id == req.params.id){
        const listings = await Listing.find({userRef:req.params.id});
        res.status(200).json(listings)
   }else{
    return next(errorHandler(401,'You can only check you own account ..'))
   }

}
