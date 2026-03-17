import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IProperty extends Document {
  title: string;
  description: string;
  images: string[];
  pricePerNight: number;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode?: string;
  };
  propertyType: Types.ObjectId;
  amenities: Types.ObjectId;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  beds: number;

  isAvailable: boolean;
  rating?: number;

  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    pricePerNight: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String },
    },
    propertyType: {
      type: Schema.Types.ObjectId,
      ref: "PropertyType",
      required: true,
    },
    amenities: [
      {
        type: Schema.Types.ObjectId,
        ref: "Amenity",
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    maxGuests: {
      type: Number,
      required: true,
      min: [1, "At least 1 guest is required"],
    },

    bedrooms: {
      type: Number,
      required: true,
      min: [0, "Bedrooms cannot be negative"],
    },

    bathrooms: {
      type: Number,
      required: true,
      min: [1, "At least 1 bathroom is required"],
    },

    beds: {
      type: Number,
      required: true,
      min: [1, "At least 1 bathroom is required"],
      validate: {
        validator: Number.isInteger,
        message: "Beds must be a whole number",
      },
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Property: Model<IProperty> =
  mongoose.models.Property ||
  mongoose.model<IProperty>("Property", PropertySchema);

export default Property;
