// Dependencies

// Storage functions
import { insertNode } from '../../storage-fns/nodes.js';

// utils
import log from "../../Utils/log.js";
import { getNodes } from '../../storage-fns/nodes.js'
import checkNodeHealth from "../../Utils/check-node-health.js";

async function routes(fastify, options) {
  fastify.get("/nodes", async (request, reply) => {
    const nodes = await getNodes();

    return {
      name: "nodes",
      description: "Gets a list of nodes this node knows about.",
      nodes: nodes,
    };
  });

  fastify.post("/register-node", async (request, reply) => {
    let status = "Not added";
    const incomingNodeIPAddress = request.ip;
    const incomingPort = request.body.port;

    // confirm the node is active
    const nodeIsHealthy = checkNodeHealth(incomingNodeIPAddress, incomingPort);

    if (nodeIsHealthy) {
      // add the new ip address to the local storage
      const update = insertNode(`${incomingNodeIPAddress}:${incomingPort}`);
      status = update.nodeAdded ? "Added" : "Node already exists";

      if (update.nodeAdded) {
        log('info', `Registered a new node! Node location: ${incomingNodeIPAddress}:${incomingPort}`)
      }
    } else {
      status = "Node is not healthy.";
    }

    return {
      name: "register-node",
      description: "Registers a new node.",
      status,
    };
  });
}

export default routes;
