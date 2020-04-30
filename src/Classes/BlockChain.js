// Dependencies
import fetch from "node-fetch";

// Blockchain functions
import isChainValid from "./chain-fns/is-chain-valid.js";

// Project Imports
import Block from "./Block.js";
import getNodes from "../Utils/get-nodes.js";

class BlockChain {
  constructor({ difficulty = 5 }) {
    this.difficulty = difficulty;
    this.blockchain = [this.startGenesisBlock()];
  }

  getChainLength() {
    return this.blockchain.length;
  }

  getChain() {
    return this.blockchain;
  }

  startGenesisBlock() {
    return new Block(0, new Date(), "Initial Block in the Chain", "0");
  }

  obtainLatestBlock() {
    return this.blockchain[this.blockchain.length - 1];
  }

  async addNewBlock(blockData) {
    const hrstart = process.hrtime();

    const latestBlock = this.obtainLatestBlock();

    const newBlock = new Block(
      latestBlock.index + 1,
      new Date(),
      blockData,
      latestBlock.hash
    );

    const nonce = await newBlock.proofOfWork(this.difficulty);
    this.blockchain.push(newBlock);

    // add block to persistent storage

    const hrend = process.hrtime(hrstart);
    console.info("Mining time: %ds %dms", hrend[0], hrend[1] / 1000000);

    return nonce;
  }

  checkChainValidity() {
    return isChainValid(this.blockchain);
  }

  /**
   * Consensus algorithm, it resolves conflicts by replacing our chain with the
   * longest one in the network.
   */
  async resolveConflicts() {
    // we are only loking for chains longer than ours
    const nodes = getNodes();

    // get a list of nodes that have longer chains
    const fetchNodes = nodes.map(async (node) => {
      const response = await fetch(`http://${node}`);
      const body = await response.json();

      if (body.chainLength > this.getChainLength()) {
        return {
          location: node,
          chainLength: body.chainLength,
        };
      }

      return null;
    });

    const nodeResponses = await Promise.all(fetchNodes);

    // filter out the nulls and then sort by chain length
    const betterNodes = nodeResponses
      .filter((item) => item !== null)
      .sort((a, b) => (a.chainLength > b.chainLength ? -1 : 1));

    // now check to make sure the longest chain is valid. If it isn't, then
    // move on to the next one
    for (let ii = 0; ii < betterNodes.length; ii += 1) {
      const node = betterNodes[ii];
      const response = await fetch(`http://${node.location}/chain`);
      const body = await response.json();
      const { chain } = body;

      const chainIsValid = isChainValid(chain);
      console.log(chainIsValid);
    }
  }
}

export default BlockChain;
