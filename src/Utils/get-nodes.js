// dependencies
import fs from "fs";
import path from "path";
import isIP from 'is-ip'

// utils
import getStoragePath from "./get-storage-path.js";

const isValidIP = (value) => {
  try {
    const [ip, port] = value.split(':');
    return isIP(ip);
  }
  catch (ermahgerd) {
    // pass
  }

  return false;
}

const getNodes = () => {
  const nodesCollection = getStoragePath("nodes");

  const localNodesRaw = fs.readFileSync(nodesCollection, "utf8");
  const nodesList = localNodesRaw.split("\n").filter(item => { return isValidIP(item); });

  return nodesList;
};

export default getNodes;
