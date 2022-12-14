require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('hardhat-docgen');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 20
      }
    }
  },
  networks: {
    hardhat: {
      accounts: {
        accountsBalance: '105000000000000000000'
      }
    },
    matic: {
      accounts: {mnemonic: process.env.DEPLOYER_MNEMONIC},
      url: process.env.MATIC_RPC
    },
    mumbai: {
      accounts: {mnemonic: process.env.DEPLOYER_MNEMONIC},
      url: process.env.MUMBAI_RPC,
      gasPrice: 50000000000
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY,
 },
 docgen: {
   path: './docs',
   clear: true,
   runOnCompile: false,
 },
};
