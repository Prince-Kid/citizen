import mongoose, { Document, Schema } from "mongoose";

export interface IComplaint extends Document {
  title: string;
  description: string;
  category: string;
  status: "pending" | "in_progress" | "resolved" | "rejected";
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  submittedBy: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  department?: mongoose.Types.ObjectId;
  priority: "low" | "medium" | "high";
  attachments?: string[];
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
}

const complaintSchema = new Schema<IComplaint>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters long"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      minlength: [3, "Category must be at least 3 characters long"],
      maxlength: [50, "Category cannot exceed 50 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "in_progress", "resolved", "rejected"],
        message: "{VALUE} is not a valid status",
      },
      default: "pending",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function (v: number[]) {
            return (
              v.length === 2 &&
              v[0] >= -180 &&
              v[0] <= 180 &&
              v[1] >= -90 &&
              v[1] <= 90
            );
          },
          message: "Invalid coordinates",
        },
      },
    },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Submitter is required"],
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "{VALUE} is not a valid priority",
      },
      default: "medium",
    },
    attachments: [
      {
        type: String,
        trim: true,
      },
    ],
    resolution: {
      type: String,
      trim: true,
      maxlength: [1000, "Resolution cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
complaintSchema.index({ status: 1 });
complaintSchema.index({ category: 1 });
complaintSchema.index({ submittedBy: 1 });
complaintSchema.index({ assignedTo: 1 });
complaintSchema.index({ department: 1 });
complaintSchema.index({ priority: 1 });
complaintSchema.index({ createdAt: -1 });
complaintSchema.index({ location: "2dsphere" });

export const Complaint = mongoose.model<IComplaint>(
  "Complaint",
  complaintSchema
);
