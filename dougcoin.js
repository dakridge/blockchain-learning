// Dependencies
import faker from "faker";
import commandLineArgs from "command-line-args";

// Project imports
import Api from "./src/Api/index.js";
import BlockChain from "./src/Classes/BlockChain.js";

// configuration
import parseConfig from "./src/Utils/parse-config.js";

const main = async () => {
  const COUNT = 200;
  const DIFFICULTY = 6;

  // parse args
  const options = commandLineArgs([
    { name: "port", alias: "p", type: Number },
    { name: "count", alias: "c", type: Number },
  ]);

  const PORT = options.port || config.PORT;

  // get the config
  const config = parseConfig();

  const startTime = process.hrtime();
  const dougCoin = new BlockChain({
    port: PORT,
    difficulty: DIFFICULTY,
  });
  await dougCoin.resolveConflicts();

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
