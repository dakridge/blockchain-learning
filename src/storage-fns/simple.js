// dependencies
import fs from "fs";
import path from "path";
import fse from 'fs-extra';

// get current directory
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// configuration
const FILE_NAME = 'chain'
const STORAGE_LOCATION = path.join(__dirname, "../../storage/simple-blockchain");

// some state
const CHAIN_IS_LOCKED = false;

const getFilePath = async () => {
    const filePath = path.join(STORAGE_LOCATION, FILE_NAME);
    await fse.ensureFile(filePath);

    return filePath;
}

export const getChain = async () => {
    let blockchain = [];
    const filePath = await getFilePath();

    try {
        blockchain = await fse.readJson(filePath);
    }
    catch (ermahgerd) {
        blockchain = [];
    }

    return blockchain;
}

export const getChainLength = async () => {
    const chain = await getChain();
    return chain.length;
}

export const saveBlock = async (blockIndex, block) => {
    let chain = await getChain();
    const filePath = await getFilePath();

    if (chain.length === blockIndex) {
        chain.push(block);
    }
    else if (chain.length > blockIndex) {
        chain[blockIndex] = block;
    }
    else {
        // fill the empty space with nulls
        const emptyArray = Array.from({ length: (blockIndex - chain.length + 1) })
        chain = chain.concat(emptyArray);

        // add the block to the chain
        chain[blockIndex] = block;
    }

    // write to file
    await fse.writeJson(filePath, chain, { spaces: 2 });

    return {
        saved: true,
    }
}