// Dependencies
import faker from "faker";
import { workerData, parentPort } from 'worker_threads';

// Project
import BlockChain from "./src/Classes/BlockChain.js";

const miner = () => {
    const dougCoin = new BlockChain({ difficulty: 5 });

    Array.from({ length: 10 }).forEach(() => {
        dougCoin.addNewBlock({
            sender: faker.name.firstName(),
            recipient: faker.name.firstName(),
            quantity: faker.random.number(250),
        });

        parentPort.postMessage({ dougCoin })
    });
};

miner();