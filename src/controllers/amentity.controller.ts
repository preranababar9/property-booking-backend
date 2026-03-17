import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import Amenity from "../models/amenity.model";
import { Types } from "mongoose";

// .lean() is good because it returns plain JavaScript objects instead of Mongoose documents, which makes queries faster

export const createAmenity = asyncHandler(
  async (req: Request, res: Response) => {
    const amenity = await Amenity.create(req.body);
    res.status(201).json({
      success: true,
      data: amenity,
    });
  },
);

export const getAllAmenities = asyncHandler(
  async (req: Request, res: Response) => {
    const amenities = await Amenity.find().lean();
    res.status(200).json({
      success: true,
      data: amenities,
    });
  },
);

export const getAmenityById = asyncHandler(
  async (req: Request, res: Response) => {
    const id = String(req.params.id);

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid amenity id" });
      return;
    }

    const amenity = await Amenity.findById(id).lean();
    if (!amenity) {
      res.status(404).json({ message: "Amenity not found" });
      return;
    }

    res.status(200).json({
      success: true,
      data: amenity,
    });
  },
);

export const updateAmenity = asyncHandler(
  async (req: Request, res: Response) => {
    const id = String(req.params.id);

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid amenity id" });
      return;
    }

    const amenity = await Amenity.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
      runValidators: true,
    }).lean();

    if (!amenity) {
      res.status(404).json({ message: "Amenity not found" });
      return;
    }

    res.status(200).json({
      success: true,
      data: amenity,
    });
  },
);

export const deleteAmenity = asyncHandler(
  async (req: Request, res: Response) => {
    const id = String(req.params.id);

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid amenity id" });
      return;
    }

    const amenity = await Amenity.findByIdAndDelete(id).lean();

    if (!amenity) {
      res.status(404).json({ message: "Amenity not found" });
      return;
    }

    res.status(200).send();
  },
);
