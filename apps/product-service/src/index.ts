import app from "./app.js";

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`Product service is running on port ${PORT}`);
  console.log(`Documentation available at http://localhost:${PORT}/docs`);
});

// Handle graceful shutdown
const gracefulShutdown = () => {
  server.close(() => {
    console.log("Product service closed");
    process.exit(0);
  });
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
