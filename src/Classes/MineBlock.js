// Dependencies
import faker from "faker";
import crypto from "crypto-js";
import { workerData, parentPort } from 'worker_threads';

// Project Imports
import computeHash from './chain-fns/compute-hash.js';

const mineBlock = (data) => {
    let nonce = 0;
    let hash = '';

    const { precedingHash, difficulty } = workerData;
    const previousMatch = precedingHash.slice(-difficulty);

    while (hash.substring(0, difficulty) !== previousMatch) {
        nonce++;
        hash = computeHash(nonce);
    }

    parentPort.postMessage({ hash, nonce });
}

mineBlock();