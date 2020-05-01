// dependencies
import fs from "fs";
import path from "path";
import crypto from "crypto-js";
import { Worker } from "worker_threads";
import formatISO from 'date-fns/formatISO/index.js';

// Chain functions
import computeHash from "./chain-fns/compute-hash.js";

// utils
import getStoragePath from "../Utils/get-storage-path.js";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

class Block {
  constructor(index, timestamp, data, precedingHash = null) {
    this.index = index;
    this.timestamp = formatISO(timestamp);
    this.data = data;
    this.precedingHash = precedingHash;
    this.hash = this.computeHash();
    this.nonce = 0;
  }

  computeHash() {
    return computeHash(
      this.index,
      this.precedingHash,
      this.timestamp,
      this.data,
      this.nonce
    );
  }

  async proofOfWork(difficulty) {
    return new Promise((resolve, reject) => {
      const miner = new Worker(path.join(__dirname, "./MineBlock.js"), {
        workerData: {
          index: this.index,
          precedingHash: this.precedingHash,
          timestamp: this.timestamp,
          data: JSON.stringify(this.data),
          difficulty: difficulty,
        },
      });

      miner.on("message", (data) => {
        const { nonce } = data;

        this.nonce = nonce;
        this.hash = this.computeHash();

        resolve(data);
      });

      miner.on("error", (ermahgerd) => {
        console.log("error - ", ermahgerd);
      });
    });
  }
}

export default Block;
