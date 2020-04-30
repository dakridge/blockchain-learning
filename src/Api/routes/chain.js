// Dependencies

// Project Imports
import parseConfig from "../../Utils/parse-config.js";
import getIPAddress from "../../Utils/get-ip-address.js";

async function routes(fastify, options) {
  fastify.get("/chain", async (request, reply) => {
    const config = parseConfig();

    let chain = [];
    let chainLength = 0;
    try {
      chain = fastify.dougcoin.getChain();
      chainLength = fastify.dougcoin.getChainLength();
    } catch (err) {
      chain = [];
      chainLength = 0;
    }

    return JSON.stringify(
      {
        chain,
        chainLength,
      },
      null,
      2
    );
  });
}

export default routes;
