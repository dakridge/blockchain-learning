// dependencies
import fs from "fs";
import path from "path";

// utils
import getStoragePath from './get-storage-path.js';

const getNodes = () => {
  const nodesCollection = getStoragePath('nodes');

  const localNodesRaw = fs.readFileSync(nodesCollection, "utf8");
  const nodesList = localNodesRaw.split("\n");

  return nodesList;
};

export default getNodes;
