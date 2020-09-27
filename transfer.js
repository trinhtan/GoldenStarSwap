const HmyFunction = require('./hmy/scripts');
const EthFunction = require('./eth/scripts');

exports.transferERC20toONE = async function (
  ethUserPrivateKey, // eth sender
  hmyUserAddress, // hmy receiver
  erc20TokenAddress, // ERC20 Token contract Address
  amount
) {
  try {
    await EthFunction.checkBalanceAndApproveEthManger(ethUserPrivateKey, erc20TokenAddress, amount);

    let lockedEvent = await EthFunction.lockERC20Token(
      erc20TokenAddress,
      ethUserPrivateKey,
      amount,
      hmyUserAddress
    );

    console.log(lockedEvent);
    // await EthFunction.checkBlock(lockedEvent.blockNumber);
    let amountUSD = lockedEvent.returnValues['5'];

    await HmyFunction.unlockOne(amountUSD, hmyUserAddress, lockedEvent.transactionHash);

    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

exports.transferETHtoONE = async function (
  ethUserPrivateKey, // eth sender
  hmyUserAddress, // hmy receiver
  amount
) {
  try {
    let lockedEvent = await EthFunction.lockETH(ethUserPrivateKey, amount, hmyUserAddress);

    console.log(lockedEvent);
    console.log(lockedEvent);
    // await EthFunction.checkBlock(lockedEvent.blockNumber);
    let amountUSD = lockedEvent.returnValues['5'];
    await HmyFunction.unlockOne(amountUSD, hmyUserAddress, lockedEvent.transactionHash);

    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

exports.transferONEtoERC20 = async function (
  hmyUserPrivateKey,
  erc20TokenAddress,
  amountONE,
  ethUserAddress
) {
  let lockedEvent = await HmyFunction.lockOne(
    hmyUserPrivateKey,
    erc20TokenAddress,
    amountONE,
    ethUserAddress
  );
};

// exports.getSymbol = async function (address) {
//   if (address == '0xad6d458402f60fd3bd25163575031acdce07538d') {
//     return 'DAI';
//   }
// };

// this.transferERC20toONE(
//   '4bbf6348fd657d6dbd5987251f2413d217f7c2601185a6343e87a7c22621d0fe',
//   '0xc162199cDaeAa5a82f00651dd4536F5d2d4277C5',
//   '0xad6d458402f60fd3bd25163575031acdce07538d',
//   '1000000000000000000'
// );

// this.transferETHtoONE(
//   '4bbf6348fd657d6dbd5987251f2413d217f7c2601185a6343e87a7c22621d0fe',
//   '0xc162199cDaeAa5a82f00651dd4536F5d2d4277C5',
//   '10000000000000000'
// );
