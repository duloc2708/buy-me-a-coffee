require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const GOERLI_URL = 'https://eth-goerli.g.alchemy.com/v2/da3vLeCjgKuqCEdNWN4k5yZ11H94wP6t';
const PRIVATE_KEY = 'a0aa70c384cb80fef3c6a62f4319a5d8b4d3fee39f41119885742376d222ca2c';

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  etherscan: {
    apiKey: "V9I54HAGGN1HJDYNZJ8ZP4NC878YM9NKBU",
  },
  networks: {
    goerli: {
      url: GOERLI_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
};
