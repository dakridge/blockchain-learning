// Dependencies
import fetch from "node-fetch";

const checkNodeHealth = async (ipAddress, nodePort) => {
  try {
    const response = await fetch(`http://${ipAddress}:${nodePort}`);
    const body = await response.json();

    // it is healthy if isHealthy is true and the version is the expected version
    return body.isHealthy === true && body.version === config.VERSION;
  }
  catch (ermahgerd) {
    // pass
  }

  return false;
};

export default checkNodeHealth;
