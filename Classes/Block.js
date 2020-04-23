// dependencies
import crypto from "crypto-js";

class Block {
  constructor(index, timestamp, data, precedingHash = null) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.precedingHash = precedingHash;
    this.hash = this.computeHash();
    this.nonce = 0;
  }

  computeHash() {
    return crypto
      .SHA256(
        this.index +
          this.precedingHash +
          this.timestamp +
          JSON.stringify(this.data) +
          this.nonce
      )
      .toString();
  }

  proofOfWork(difficulty) {
    const previousMatch = this.precedingHash.slice(-difficulty);

    while (this.hash.substring(0, difficulty) !== previousMatch) {
      this.nonce++;
      this.hash = this.computeHash();
    }
  }
}

export default Block;
