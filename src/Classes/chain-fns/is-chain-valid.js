// Blockchain functions
import computeHash from "./compute-hash.js";

const isChainValid = (blockchain) => {
  for (let ii = 1; ii < blockchain.length; ii++) {
    const currentBlock = blockchain[ii];
    const precedingBlock = blockchain[ii - 1];

    const computedHash = computeHash(
      currentBlock.index,
      currentBlock.precedingHash,
      currentBlock.timestamp,
      currentBlock.data,
      currentBlock.nonce
    );

    if (currentBlock.hash !== computedHash) {
      return false;
    }

    if (currentBlock.precedingHash !== precedingBlock.hash) {
      return false;
    }
  }

  return true;
};

export default isChainValid;
