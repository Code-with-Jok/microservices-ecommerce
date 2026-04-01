import { serve } from "@hono/node-server";
import app from "./app.js";

const PORT = process.env.PORT || 8002;

const start = async () => {
  try {
    serve(
      {
        fetch: app.fetch,
        port: Number(PORT),
      },
      (info) => {
        console.log(
          `Payment service is running on http://localhost:${info.port}`
        );
        console.log(
          `Documentation available at http://localhost:${info.port}/docs`
        );
      }
    );
  } catch (error) {
    console.error("Failed to start payment service", error);
    process.exit(1);
  }
};

start();
