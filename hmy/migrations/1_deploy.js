const HmyBridge = artifacts.require('HmyBridge');

module.exports = async function (deployer) {
  try {
    await deployer.deploy(HmyBridge);
  } catch (error) {
    console.log(error);
  }
  return;
};
