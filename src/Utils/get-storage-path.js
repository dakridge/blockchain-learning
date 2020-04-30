// dependencies
import fs from "fs";
import path from "path";

const getStoragePath = (collection) => {
    let collectionPath = null;
    const __dirname = path.dirname(new URL(import.meta.url).pathname);

    if (collection === 'nodes') {
        collectionPath = path.join(__dirname, "../../storage/nodes-list");
    }

    return collectionPath;
}

export default getStoragePath;
