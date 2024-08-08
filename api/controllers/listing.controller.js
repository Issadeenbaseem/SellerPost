import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
//import { errorHandler } from "../utils/error";

export const createList = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const userListUpdate = async (req, res, next) => {
  const listings = await Listing.findById(req.params.id);

  if (!listings) {
    return next(errorHandler(404, "list not not found ..."));
  }

  if (req.user.id !== listings.userRef) {
    return next(errorHandler(403, "user only update their own listings ....."));
  }

  try {
    const UpdatedList = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(UpdatedList);
  } catch (error) {
    next(error);
  }
};
export const userListFind = async (req, res, next) => {
  try {
    const list = await Listing.findById(req.params.id);

    if (!list) {
      return next(errorHandler(404, "list not found ... "));
    }

    res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};
