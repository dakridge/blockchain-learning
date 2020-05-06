// dependencies
import fs from "fs";
import path from "path";
import faker from 'faker';
import fse from 'fs-extra';

// get current directory
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// configuration 
const DIR_PER_DIR = 8;
const STORAGE_DEPTH = 3;
const FILES_PER_DIR = 16;
const BLOCKS_PER_FILE = 16;
const STORAGE_LOCATION = path.join(__dirname, "../../storage/blockchain");

const TOTAL_FILES = Math.pow(DIR_PER_DIR, STORAGE_DEPTH - 1) * FILES_PER_DIR;
const TOTAL_BLOCKS = TOTAL_FILES * BLOCKS_PER_FILE;

/**
 * This storage system is like a bunch of trees. The storage depth is how deep 
 * the tree to grow. So a dept of 0 is a flat structure where we just have a
 * bunch of files in main folder. A depth of 1 is just a single folder deep and
 * each folder has n files.
 * 
 * When a tree is full, we plant a new one at the ground level.
 * 
 * This is what a tree with a depth of 1 would look like if there were 2 
 * folders per directory and 3 files per directory.
 * 
 *                        O
 *                       / \
 *                      /   \ 
 *                     /     \
 *                    O       O
 *                   /|\     /|\
 *                  / | \   / | \
 *                 F  F  F F  F  F
 */
const calculateFilesPerTree = (storageDepth = STORAGE_DEPTH) => {
    if (storageDepth === 0) {
        return 1;
    }

    const totalFiles = Math.pow(DIR_PER_DIR, storageDepth - 1) * FILES_PER_DIR;
    return totalFiles;
}

const getFileLocation = (fileIndex, storageDepth = STORAGE_DEPTH) => {
    let locationPath = [];

    // for the first level, we need to figure out if we need to plan a new tree
    const filesPerTree = calculateFilesPerTree();
    locationPath.push(Math.floor(fileIndex / filesPerTree));

    for (let ii = 1; ii < storageDepth; ii += 1) {
        const localDepth = STORAGE_DEPTH - ii;
        const fileCount = calculateFilesPerTree(localDepth);
        const treeIndex = Math.floor(fileIndex / fileCount) % DIR_PER_DIR;

        // update the location path array
        locationPath.push(treeIndex);
    }

    // get the file index in the last folder
    locationPath.push(fileIndex % FILES_PER_DIR);

    return locationPath;
}

const getBlockLocation = (blockIndex) => {
    const fileIndex = Math.floor(blockIndex / BLOCKS_PER_FILE);
    const fileLocation = getFileLocation(fileIndex);

    return fileLocation;
}

const createInitialFile = (filePath) => {
    const emptyFile = Array.from({ length: BLOCKS_PER_FILE }).fill(null);
    return fse.writeJson(filePath, emptyFile);
}

const writeToBlock = async (blockIndex, data) => {
    const fileIndex = Math.floor(blockIndex / BLOCKS_PER_FILE);
    const locationKeyPath = getFileLocation(fileIndex);
    const fileName = locationKeyPath[locationKeyPath.length - 1];

    const dirPath = path.join(STORAGE_LOCATION, locationKeyPath.slice(0, -1).join('/'));
    const filePath = path.join(dirPath, `${fileName}.json`)

    // ensure the path exists
    await fse.ensureDir(dirPath);

    // if the file doesn't exist, write an empty file
    const fileExists = await fse.pathExists(filePath);
    if (!fileExists) {
        await fse.ensureFile(filePath);
        await createInitialFile(filePath);
    }

    // get the blocks index in the file
    const blockFileIndex = blockIndex % FILES_PER_DIR;

    // read JSON data from the file and update it with the new json
    const existingJson = await fse.readJson(filePath);
    existingJson[blockFileIndex] = data;

    // write the new JSON object to the file
    await fse.writeJson(filePath, existingJson);
}

// testing
const totalFiles = calculateFilesPerTree(STORAGE_DEPTH);
console.log('files in tree: ', totalFiles);
console.log('Blocks in tree: ', totalFiles * BLOCKS_PER_FILE);

const fileLocation = getFileLocation(257);
console.log('file location: ', fileLocation);

const blockLocation = getBlockLocation(4097);
console.log('block location ', blockLocation);

const main = async () => {
    for (let ii = 0; ii < (totalFiles * BLOCKS_PER_FILE) * 10; ii += 1) {
        const data = {
            index: ii,
            transactions: Array.from({ length: faker.random.number(4) }).map(() => {
                return {
                    sender: faker.name.firstName(),
                    recipient: faker.name.firstName(),
                    quantity: faker.random.number(250),
                };
            })
        };

        await writeToBlock(ii, data);
    }
}

main();
