const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

let specialAddresses = [
  "0x96ef6E86a364F60cD233905D328eBB831FA94BEf",
  "0xf9013432B10E1F446bb19D5b7C15baB43E9C3867",
  "0x42C48536C1777663Ec4047c0134B261Eb7eDdFde",
  "0xf302003b0EB88EdfaF05C37c3B03147b97ac44a6",
  "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
  "0x546b87BC0cCc97fFbC819E0fDE8b2443d12D1D89",
  "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
  "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
  "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
  "0x1C1A902D6EB72dd6a7c49C45c3613d4E7445C349",
  "0x741700dd5dbd471ff8a976671fa1d0e470ec953f",
  "0x29AC8c2e77640E14D34A2DB64AE3DCC182091E95",
];
const initialLength = specialAddresses.length;
for (let i = 1; i <= 500; i++) {
  if (i < 10) {
    specialAddresses.push("0x000000000000000000000000000000000000000" + i);
  } else if (i < 100) {
    specialAddresses.push("0x00000000000000000000000000000000000000" + i);
  } else {
    specialAddresses.push("0x0000000000000000000000000000000000000" + i);
  }
  specialAddresses[i + initialLength - 1] = specialAddresses[
    i + initialLength - 1
  ].replaceAll("9", "a");
}
const leaves = specialAddresses.map((v) => keccak256(v));
const tree = new MerkleTree(leaves, keccak256, { sort: true });

export const getProof = async (leaf) => {
    let proof = tree.getHexProof(keccak256(leaf));
  if (proof.length > 0) {
    return proof;
  } else {
    return ["0x0000000000000000000000000000000000000000000000000000000000000000"]
  }
}

export const getRoot = () => {
    let root = tree.getHexRoot();
    return root;
}