import mongoose, { Document, Schema } from "mongoose";

export interface IDepartment extends Document {
  name: string;
  description: string;
  head: mongoose.Types.ObjectId;
  contactEmail: string;
  contactPhone: string;
  address: string;
  categories: string[];
  createdAt: Date;
  updatedAt: Date;
}

const departmentSchema = new Schema<IDepartment>(
  {
    name: {
      type: String,
      required: [true, "Department name is required"],
      trim: true,
      minlength: [3, "Department name must be at least 3 characters long"],
      maxlength: [50, "Department name cannot exceed 50 characters"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters long"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    head: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Department head is required"],
    },
    contactEmail: {
      type: String,
      required: [true, "Contact email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    contactPhone: {
      type: String,
      required: [true, "Contact phone is required"],
      trim: true,
      match: [/^\+?[\d\s-]{10,}$/, "Please enter a valid phone number"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      maxlength: [200, "Address cannot exceed 200 characters"],
    },
    categories: [
      {
        type: String,
        trim: true,
        minlength: [3, "Category must be at least 3 characters long"],
        maxlength: [50, "Category cannot exceed 50 characters"],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
departmentSchema.index({ name: 1 }, { unique: true });
departmentSchema.index({ head: 1 });
departmentSchema.index({ categories: 1 });

export const Department = mongoose.model<IDepartment>(
  "Department",
  departmentSchema
);
