import Listing from "../models/listing.model.js";

export const createListing = async (req, res, next) => {
  try {
    const listings = await Listing.create(req.body);
    return res.status(201).json(listings);
  } catch (error) {
    next(error);
  }
};


export const getUserListings = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "Unauthorized access"));
  try {
    const listings = await Listing.find({ userRef: req.params.id });
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};


