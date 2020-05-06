// Dependencies
import fetch from "node-fetch";

// Blockchain functions
import isChainValid from "./chain-fns/is-chain-valid.js";

// Storage functions
import { getNodes } from '../storage-fns/nodes.js';
import { getChain, saveBlock } from '../storage-fns/simple.js';

// Project Imports
import Block from "./Block.js";

class BlockChain {
  constructor({ difficulty = 5, port = 0 }) {
    this.port = port;
    this.difficulty = difficulty;
    this.blockchain = [];
  }

  async initialize() {
    const chain = await getChain();

    if (!chain || chain.length === 0) {
      this.blockchain = [await this.startGenesisBlock()]
    }
    else {
      this.blockchain = chain;
    }
  }

  getChainLength() {
    return this.blockchain.length;
  }

  getChain() {
    return this.blockchain;
  }

  async startGenesisBlock() {
    const block = new Block(0, new Date(), "Initial Block in the Chain", "0");
    await saveBlock(0, block);

    return block;
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
    await saveBlock(latestBlock.index + 1, newBlock);

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
    const nodes = await getNodes();

    // get a list of nodes that have longer chains
    const fetchNodes = nodes.map(async (node) => {
      try {
        const response = await fetch(`http://${node}`);
        const body = await response.json();

        if (body.chainLength > this.getChainLength()) {
          return {
            location: node,
            chainLength: body.chainLength,
          };
        }

        return null;
      } catch (ermahgerd) {
        return null;
      }
    });

    const nodeResponses = await Promise.all(fetchNodes);

    // filter out the nulls and then sort by chain length
    const betterNodes = nodeResponses
      .filter((item) => item !== null)
      .sort((a, b) => (a.chainLength > b.chainLength ? -1 : 1));

    if (betterNodes.length === 0) {
      console.log("No better nodes were found.");
    }

    // now check to make sure the longest chain is valid. If it isn't, then
    // move on to the next one
    for (let ii = 0; ii < betterNodes.length; ii += 1) {
      const node = betterNodes[ii];
      const response = await fetch(`http://${node.location}/chain`);
      const body = await response.json();
      const { chain } = body;

      const chainIsValid = isChainValid(chain);

      if (chainIsValid) {
        console.log('We found a good node.');
      }
    }
  }
}

export default BlockChain;
