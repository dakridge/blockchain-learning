// Dependencies
import fetch from "node-fetch";

// configuration
import parseConfig from "../Utils/parse-config.js";

const checkNodeHealth = async (ipAddress) => {
  const config = parseConfig();

  const response = await fetch(`http://${ipAddress}:${config.PORT}`);
  const body = await response.json();

  // it is healthy if isHealthy is true and the version is the expected version
  return body.isHealthy === true && body.version === config.VERSION;
};

export default checkNodeHealth;
