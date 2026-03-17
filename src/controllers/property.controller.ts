import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import Property from "../models/property.model";
import { Types } from "mongoose";

export const createProperty = asyncHandler(
  async (req: Request, res: Response) => {
    const property = await Property.create(req.body);
    res.status(201).json({
      success: true,
      data: property,
    });
  },
);

export const getAllProperties = asyncHandler(
  async (req: Request, res: Response) => {
    const property = await Property.find().lean();
    res.status(200).json({
      success: true,
      data: property,
    });
  },
);

export const getPropertyById = asyncHandler(
  async (req: Request, res: Response) => {
    const id = String(req.params.id);

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid property id" });
      return;
    }
    const property = await Property.findById(id).lean();
    if (!property) {
      res.status(404).json({ message: " Property not found" });
      return;
    }
    res.status(200).json({
      success: true,
      data: property,
    });
  },
);

export const updateProperty = asyncHandler(
  async (req: Request, res: Response) => {
    const id = String(req.params.id);

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid property id" });
      return;
    }
    const property = await Property.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
      runValidators: true,
    }).lean();
    if (!property) {
      res.status(404).json({ message: " Property not found" });
      return;
    }
    res.status(200).json({
      success: true,
      data: property,
    });
  },
);

export const deleteProperty = asyncHandler(async(req:Request, res: Response) => {
     const id = String(req.params.id);

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid property id" });
      return;
    }
 const property = await Property.findByIdAndDelete(id).lean();
    if (!property) {
      res.status(404).json({ message: " Property not found" });
      return;
    }
    res.status(200).send();

})
