import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectOrderDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL is not defined in env file!");
  }

  connectionPromise = mongoose
    .connect(process.env.MONGO_URL)
    .then((conn) => {
      console.log("Connected to MongoDB successfully");
      connectionPromise = null;
      return conn;
    })
    .catch((error) => {
      connectionPromise = null;
      console.error("Database connection failed:", error.message);
      throw new Error(
        "Could not connect to the database. Please check your configuration."
      );
    });

  return connectionPromise;
};
