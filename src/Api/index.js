// Dependencies
import Fastify from "fastify";
import helmet from "fastify-helmet";

// routes
import getRoutes from "./routes/index.js";

// instantiate Fastify
const app = Fastify({
  logger: true,
  ignoreTrailingSlash: true,
});

// add plugins
app.register(helmet);
app.register(import("fastify-routes"));

// register the routes
getRoutes().forEach((routeFile) => {
  app.register(import(`./routes/${routeFile}`));
});

export default app;
