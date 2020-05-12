// Dependencies

// Project Imports
import parseConfig from "../../Utils/parse-config.js";
import getIPAddress from "../../Utils/get-ip-address.js";

async function routes(fastify, options) {
  fastify.get("/", async (request, reply) => {
    const config = parseConfig();

    let chainLength = 0;
    try {
      chainLength = fastify.dougcoin.getChainLength();
    } catch (err) {
      chainLength = 0;
    }

    return {
      name: "dougcoin api",
      description: "Home of this node.",
      ipAddress: getIPAddress(),
      isHealthy: true,
      version: config.VERSION,
      chainLength,
    };
  });

  fastify.get("/help", async (request, reply) => {
    const routesJson = [];
    const foundRoutes = fastify.routes.keys();

    for (const [routePath, routeConfig] of fastify.routes) {
      routesJson.push({
        path: routePath,
        ...routeConfig,
      });
    }

    return routesJson;
  });
}

export default routes;
