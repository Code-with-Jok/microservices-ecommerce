import createApp from "./app.js";
import { connectOrderDB } from "@repo/order-db";

const start = async () => {
  const app = await createApp();
  const port = Number(process.env.PORT) || 8001;
  const host = "0.0.0.0";

  try {
    await connectOrderDB();
    await app.listen({ port, host });
    console.log(`Order service is running on ${host}:${port}`);
    console.log(`Documentation available at http://localhost:${port}/docs`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
