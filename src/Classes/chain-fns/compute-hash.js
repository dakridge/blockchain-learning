// dependencies
import crypto from "crypto-js";
import stringify from 'json-stable-stringify';

const computeHash = (index, precedingHash, timestamp, data, nonce) => {
  // console.table({ index, precedingHash, timestamp, data, nonce });
  return crypto
    .SHA256(index + precedingHash + timestamp + stringify(data) + nonce)
    .toString();
};

export default computeHash;
