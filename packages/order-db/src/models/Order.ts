import mongoose, { InferSchemaType } from "mongoose";

export const OrderStatus = ["success", "failed"] as const;

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    amount: { 
      type: Number, 
      required: true,
      min: [0, "Amount cannot be negative"] 
    },
    status: { 
      type: String, 
      required: true, 
      enum: OrderStatus 
    },
    products: {
      type: [
        {
          name: {
            type: String,
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity must be at least 1"]
          },
          price: {
            type: Number,
            required: true,
            min: [0, "Item price cannot be negative"]
          },
        },
      ],
      required: [true, "Order must contain at least one product"],
      validate: {
        validator: function (v: any[]) {
          return v && v.length > 0;
        },
        message: "Order items list cannot be empty"
      }
    },
  },
  { timestamps: true }
);

export type OrderSchemaType = InferSchemaType<typeof OrderSchema>;

// Tránh OverwriteModelError bằng cách kiểm tra model đã tồn tại trước khi tạo mới
export const Order = mongoose.models.Order || mongoose.model<OrderSchemaType>("Order", OrderSchema);
