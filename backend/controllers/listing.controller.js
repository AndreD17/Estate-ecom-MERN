import Listing from "../models/listing.model.js";

export const createListing = async (req, res, next) => {
  try {
    const listings = await Listing.create(req.body);
    return res.status(201).json(listings);
  } catch (error) {
    next(error);
  }
};


