import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
});

const start = async () => {
  const port = Number(process.env.PORT) || 8001;
  const host = "0.0.0.0";
  try {
    await fastify.listen({ port, host });
    fastify.log.info(`Order service is running on ${host}:${port}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
