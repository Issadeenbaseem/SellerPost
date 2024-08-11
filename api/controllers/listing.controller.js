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

export const userListFinds  =async (req,res,next) =>{
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
    
    console.log(res.status(200).json(listings))
  } catch (error) {
    next(error);
  }

}

