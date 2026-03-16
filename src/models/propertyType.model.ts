import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPropertyType extends Document {
  name: string;
  description?: string;
  iconUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PropertyTypeSchema = new Schema<IPropertyType>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: {
      type: String,
    },
    iconUrl: {
      type: String,
    }
  },
  {
    timestamps: true,
  },
);

const PropertyType: Model<IPropertyType> =
  (mongoose.models.PropertyType as Model<IPropertyType>) ||
  mongoose.model<IPropertyType>("PropertyType", PropertyTypeSchema);

export default PropertyType;
