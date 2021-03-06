// Dependencies
import faker from "faker";
import commandLineArgs from "command-line-args";

// Project imports
import log from "./src/Utils/log.js";
import Api from "./src/Api/index.js";
import BlockChain from "./src/Classes/BlockChain.js";
import registerNode from "./src/Utils/register-node.js";
import getIPAddress from "./src/Utils/get-ip-address.js";

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

  // get the config
  const config = parseConfig();

  // set props
  const PORT = options.port || config.PORT;
  const DIFFICULTY = options.difficulty || config.DIFFICULTY;

  const startTime = process.hrtime();

  // determine location
  const address = getIPAddress();

  // startup print
  log("important", `Starting the dougcoin miner. Difficulty=${DIFFICULTY}`);
  log("info", `Running at: ${address}:${PORT}`);

  // instantiate the blockchain
  const dougCoin = new BlockChain({
    port: PORT,
    difficulty: DIFFICULTY,
  });

  // check with other nodes and
  await dougCoin.startup();
  // await dougCoin.resolveConflicts();
  await registerNode({ port: PORT });

  Api.decorate("dougcoin", dougCoin);

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
