import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAmenity extends Document {
  name: string;
  iconUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AmenitySchema = new Schema<IAmenity>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    iconUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Amenity: Model<IAmenity> =
  (mongoose.models.Amenity as Model<IAmenity>) ||
  mongoose.model<IAmenity>("Amenity", AmenitySchema);

export default Amenity;