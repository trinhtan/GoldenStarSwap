require('dotenv').config();
const EthBridge = artifacts.require('EthBridge');

module.exports = async function (deployer) {
  try {
    await deployer.deploy(EthBridge, {
      gas: 4612388,
      from: process.env.ETH_OPERATOR_ADDRESS
    });
  } catch (err) {
    console.log(err);
  }
};
