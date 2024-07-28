import User from "../models/user.model.js";
import bcrypt from "bcryptjs"

export const signUp = (req,res)=>{
   const {username,email,password} = req.body;
   const hashPassword = bcrypt.hashSync(password,10)
   const newUser = new User({username,email,password:hashPassword});
   newUser.save();
   res.status(201).json('user create successfully ...')

}