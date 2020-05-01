// Dependencies
import fetch from "node-fetch";

// configuration
import log from '../Utils/log.js'
import getNodes from "../Utils/get-nodes.js";

const registerNode = async ({ port = 0 }) => {
  const nodes = getNodes();

  const registrationRequests = nodes.map(async (node) => {
    try {
      const response = await fetch(`http://${node}/register-node`, {
        method: "POST",
        body: JSON.stringify({ port }),
        headers: { "Content-Type": "application/json" },
      });

      return response.ok;
    }
    catch (ermahgerd) {
      // pass
    }

    return false;
  });

  const registrations = await Promise.all(registrationRequests);

  // count the successful registrations
  const registrationCounts = registrations.reduce(
    (acc, current) => {
      if (current) {
        acc.success += 1;
      } else {
        acc.fail += 1;
      }

      return acc;
    },
    { success: 0, fail: 0 }
  );

  log('info', `Registered with ${registrationCounts.success} new nodes.`)

  return registrationCounts;
};

export default registerNode;
