// Dependencies
import fs from "fs";
import path from "path";

const main = () => {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);

  const routes = fs
    .readdirSync(__dirname)
    .filter((fileName) => fileName !== "index.js");

  return routes;
};

export default main;
