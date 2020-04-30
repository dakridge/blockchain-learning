// Dependencies

// utils
import addNode from "../../Utils/add-node.js";
import getNodes from "../../Utils/get-nodes.js";
import checkNodeHealth from "../../Utils/check-node-health.js";

async function routes(fastify, options) {
  fastify.get("/nodes", async (request, reply) => {
    const nodes = getNodes();

    return {
      name: "nodes",
      description: "Gets a list of nodes this node knows about.",
      nodes: nodes,
    };
  });

  fastify.get("/register-node", async (request, reply) => {
    let status = "Not added";
    const incomingNodeIPAddress = request.ip;

    // confirm the node is active
    const nodeIsHealthy = checkNodeHealth(incomingNodeIPAddress);

    if (nodeIsHealthy) {
      // add the new ip address to the local storage
      const update = addNode(incomingNodeIPAddress);
      status = update.nodeAdded ? "Added" : "Node already exists";
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
