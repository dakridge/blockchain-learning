import Block from "./Block.js";

class BlockChain {
  constructor({ difficulty = 5 }) {
    this.difficulty = difficulty;
    this.blockchain = [this.startGenesisBlock()];
  }

  startGenesisBlock() {
    return new Block(0, new Date(), "Initial Block in the Chain", "0");
  }

  obtainLatestBlock() {
    return this.blockchain[this.blockchain.length - 1];
  }

  addNewBlock(newBlock) {
    const hrstart = process.hrtime();

    newBlock.precedingHash = this.obtainLatestBlock().hash;
    newBlock.proofOfWork(this.difficulty);
    this.blockchain.push(newBlock);

    const hrend = process.hrtime(hrstart);
    console.info("Mining time: %ds %dms", hrend[0], hrend[1] / 1000000);
  }

  checkChainValidity() {
    for (let i = 1; i < this.blockchain.length; i++) {
      const currentBlock = this.blockchain[i];
      const precedingBlock = this.blockchain[i - 1];

      if (currentBlock.hash !== currentBlock.computeHash()) {
        return false;
      }

      if (currentBlock.precedingHash !== precedingBlock.hash) {
        return false;
      }
    }

    return true;
  }
}

export default BlockChain;
