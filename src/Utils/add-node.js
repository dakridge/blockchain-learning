// dependencies
import fs from "fs";
import path from "path";

// utils
import getNodes from "./get-nodes.js";
import getStoragePath from './get-storage-path.js';

/**
 * Add a new ip address to the nodes list. This is an idempotent operation.
 * @param {str} newIPAddress
 */
const addNode = (newIPAddress) => {
  const nodes = getNodes();
  const nodeExists = nodes.includes(newIPAddress);

  if (!nodeExists) {
    const nodesCollection = getStoragePath('nodes');
    fs.appendFileSync(nodesCollection, `\n${newIPAddress}`);

    return {
      nodeAdded: true,
      nodeCount: nodes.length + 1,
    };
  }

  return {
    nodeAdded: false,
    nodeCount: nodes.length,
  };
};

export default addNode;
