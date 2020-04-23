// dependencies
import faker from "faker";

import Block from "./Classes/Block.js";
import BlockChain from "./Classes/BlockChain.js";

const main = () => {
  const COUNT = 10;
  const DIFFICULTY = 5;

  const startTime = process.hrtime();
  const dougCoin = new BlockChain({ difficulty: DIFFICULTY });

  console.log("Starting to mine some doug coins.");

  Array.from({ length: COUNT }).forEach(() => {
    dougCoin.addNewBlock(
      new Block(1, new Date(), {
        sender: faker.name.firstName(),
        recipient: faker.name.firstName(),
        quantity: faker.random.number(250),
      })
    );
  });

  //   console.log(JSON.stringify(dougCoin, null, 4));

  console.log(`Congratulations, you mined ${COUNT} doug coins.`);

  const endTime = process.hrtime(startTime);
  console.info("Total time: %ds %dms", endTime[0], endTime[1] / 1000000);
};

main();
