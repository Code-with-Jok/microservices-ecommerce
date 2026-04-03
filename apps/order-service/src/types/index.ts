import { OrderSchemaType } from "@repo/order-db";

export type OrderType = Omit<OrderSchemaType, "_id"> & {
  _id: string;
};

export type OrderChartType = {
  month: string;
  total: number;
  successful: number;
};
