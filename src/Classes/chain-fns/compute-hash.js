import crypto from "crypto-js";

const computeHash = (index, precedingHash, timestamp, data, nonce) => {
  console.table({ index, precedingHash, timestamp, data, nonce });
  return crypto
    .SHA256(index + precedingHash + timestamp + JSON.stringify(data) + nonce)
    .toString();
};

export default computeHash;
