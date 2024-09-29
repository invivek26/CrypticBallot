/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * https://trufflesuite.com/docs/truffle/reference/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

require("dotenv").config();
// const mnemonic = process.env["MNEMONIC"];
// const infuraProjectId = process.env["INFURA_PROJECT_ID"];

// const HDWalletProvider = require('@truffle/hdwallet-provider');

const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
    },
    // sepolia: {
    //   provider: () => new HDWalletProvider(
    //     "ca03d6bd4e613bb2ebecd158e7a7f67d8a33dd0284133aebb856d434b7199a35", // Private key of the account
    //     "https://sepolia.infura.io/v3/90207e133736416a9b23f29a159e3166⁠" // Correct Infura Sepolia URL
    //   ),
    //   // network_id: 11155111,          // Sepolia's network ID
    //   // maxFeePerGas: 300000000000,    // Remove these lines
    //   // maxPriorityFeePerGas: 2000000000,  // Remove these lines
    // },
    sepolia: {
      provider: () =>
        new HDWalletProvider({
          privateKeys: [process.env.PRIVATE_KEY],
          providerOrUrl: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
        }),
      network_id: 11155111, // Sepolia's network ID
      gas: 9000000, // Adjust the gas limit as per your requirements
      gasPrice: 159003025302, // 20 Gwei
      confirmations: 2, // Set the number of confirmations needed for a transaction
      timeoutBlocks: 200, // Set the timeout for transactions
      skipDryRun: false, // Skip the dry run option
    },
  },
  compilers: {
    solc: {
      version: "0.8.19",
    },
  },
};
