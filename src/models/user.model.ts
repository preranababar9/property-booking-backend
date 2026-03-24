import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document{
    name: string;
    email:string;
    password: string;
     createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: {type: String, required: [true, "Name is required"], trim: true, maxLength: [100, 'Name cannot exceed 100 Characters']},
        email: {type: String, required: true, unique: true,
              trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email'
      ]
        },
        password: {type: String, required: [true, 'Password is required'], unique: true, maxLength: 6}
    },
     { timestamps: true }
)

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;