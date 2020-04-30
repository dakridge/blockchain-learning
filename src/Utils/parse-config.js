// dependencies
import fs from "fs";
import path from "path";

/**
 * Parses a json file.
 * @param {str} configLocation 
 */
const main = (configLocation = null) => {
    let configPath = null;

    if (!configLocation) {
        const __dirname = path.dirname(new URL(import.meta.url).pathname);
        configPath = path.join(__dirname, "../../config.json");
    }
    else {
        configPath = path.join(configLocation);
    }

    const rawConfig = fs.readFileSync(configPath);
    const configJson = JSON.parse(rawConfig);

    return configJson;
}

export default main;
