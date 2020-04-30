// Project Imports
import App from './index.js';

// configuration
import parseConfig from "../Utils/parse-config.js";

// Run the server!
const start = async () => {
  const config = parseConfig();

  try {
    await App.listen(config.PORT, "0.0.0.0");
    App.log.info(`server listening on ${App.server.address().port}`);
  } catch (err) {
    App.log.error(err);
    process.exit(1);
  }
};
start();
