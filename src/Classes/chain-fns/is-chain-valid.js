// Blockchain functions
import computeHash from "./compute-hash.js";

const isChainValid = (blockchain) => {
  for (let ii = 0; ii < blockchain.length; ii++) {
    const currentBlock = blockchain[ii];
    const precedingBlock = blockchain[ii - 1];

    console.log("block ", ii);
    console.log(currentBlock);
    console.log(computeHash(currentBlock));

    if (currentBlock.hash !== computeHash(currentBlock)) {
      return false;
    }

    if (currentBlock.precedingHash !== precedingBlock.hash) {
      return false;
    }
  }

  return true;
};

export default isChainValid;
