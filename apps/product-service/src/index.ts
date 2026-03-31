import cors from "cors";
import express from "express";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.listen(8000, () => {
  console.log("Product service is running on port 8000");
});
