import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import PropertyType from "../models/propertyType.model";
import { Types } from "mongoose";

export const createPropertyType = asyncHandler(
  async (req: Request, res: Response) => {
    const propertyType = await PropertyType.create(req.body);
    res.status(201).json({
      message: true,
      data: propertyType,
    });
  },
);

export const getAllPropertyType = asyncHandler(
  async (req: Request, res: Response) => {
    const propertyType = await PropertyType.find().lean();
    res.status(200).json({
      success: true,
      data: propertyType,
    });
  },
);

export const getPropertyTypeById = asyncHandler(
  async (req: Request, res: Response) => {
    const id = String(req.params.id);

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid PropertyType id" });
      return;
    }

    const propertyType = await PropertyType.findById(id).lean();
    if (!propertyType) {
      res.status(404).json({ message: "Property Type not found" });
      return;
    }

    res.status(200).json({
      success: true,
      data: propertyType,
    });
  },
);

export const updatePropertyType = asyncHandler(
  async (req: Request, res: Response) => {
    const id = String(req.params.id);

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid Property Type id" });
      return;
    }

    const propertyType = await PropertyType.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
      runValidators: true,
    }).lean();

    if (!propertyType) {
      res.status(404).json({ message: "Property Type not found" });
      return;
    }

    res.status(200).json({
      success: true,
      data: propertyType,
    });
  },
);

export const deletePropertyType = asyncHandler(
  async (req: Request, res: Response) => {
    const id = String(req.params.id);

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid Property Type id" });
      return;
    }

    const propertyType = await PropertyType.findByIdAndDelete(id).lean();

    if (!propertyType) {
      res.status(404).json({ message: "Property Type not found" });
      return;
    }

    res.status(200).send();
  },
);
