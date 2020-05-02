// Dependencies
import faker from "faker";
import commandLineArgs from "command-line-args";

// Project imports
import log from './src/Utils/log.js'
import Api from "./src/Api/index.js";
import BlockChain from "./src/Classes/BlockChain.js";
import registerNode from "./src/Utils/register-node.js";

// configuration
import parseConfig from "./src/Utils/parse-config.js";

const main = async () => {
  const COUNT = 200;

  // parse args
  const options = commandLineArgs([
    { name: "port", alias: "p", type: Number },
    { name: "count", alias: "c", type: Number },
    { name: "difficulty", alias: "d", type: Number },
  ]);

  const PORT = options.port || config.PORT;
  const DIFFICULTY = options.difficulty || config.DIFFICULTY;

  // get the config
  const config = parseConfig();

  const startTime = process.hrtime();

  // instantiate the blockchain
  const dougCoin = new BlockChain({
    port: PORT,
    difficulty: DIFFICULTY,
  });

  // check with other nodes and
  await dougCoin.resolveConflicts();
  await registerNode({ port: PORT });

  Api.decorate("dougcoin", dougCoin);

  console.log("Starting to mine some doug coins.");

  try {
    await Api.listen(PORT, "0.0.0.0");
    Api.log.info(`server listening on ${Api.server.address().port}`);
  } catch (ermahgerd) {
    console.error("Unable to run the server.");
    console.log(ermahgerd);
  }

  for (let ii = 0; ii < COUNT; ii += 1) {
    await dougCoin.addNewBlock({
      sender: faker.name.firstName(),
      recipient: faker.name.firstName(),
      quantity: faker.random.number(250),
    });
  }
};

main();
