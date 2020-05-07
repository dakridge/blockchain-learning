// dependencies
import path from "path";
import isIP from 'is-ip';
import fse from 'fs-extra';

// get current directory
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// configuration
const FILE_LOCATION = path.join(__dirname, "../../storage/nodes-list");

const getFilePath = async () => {
    const filePath = FILE_LOCATION;
    await fse.ensureFile(filePath);

    return filePath;
}

const isValidIP = (value) => {
    try {
        const [ip, port] = value.split(':');
        return isIP(ip);
    }
    catch (ermahgerd) {
        // pass
    }

    return false;
}

export const getNodes = async () => {
    let nodes = [];
    const filePath = await getFilePath();

    try {
        nodes = await fse.readJson(filePath);
    }
    catch (ermahgerd) {
        nodes = [];
    }

    return nodes.filter(item => { return isValidIP(item); });
}

export const insertNode = async (newNodeAddress) => {
    const nodes = await getNodes();
    const filePath = await getFilePath();
    const nodeExists = nodes.includes(newNodeAddress);

    if (!nodeExists) {
        nodes.push(newNodeAddress);
        await fse.writeJson(filePath, chain, { spaces: 2 });

        return {
            nodeAdded: true,
            nodeCount: nodes.length + 1,
        };
    }

    return {
        nodeAdded: false,
        nodeCount: nodes.length,
    };
}