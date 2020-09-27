require('dotenv').config();

const BN = require('bn.js');

const Web3 = require('web3');
const web3 = new Web3('https://ropsten.infura.io/v3/' + process.env.INFURA_PROJECT_ID);

const ERC20 = require('./build/contracts/IERC20.json');

const EthBridge = require('./build/contracts/EthBridge.json');
const ethBridgeAddress = EthBridge.networks['3'].address;
const ethBridgeContract = new web3.eth.Contract(EthBridge.abi, ethBridgeAddress);

const AVG_BLOCK_TIME = 20 * 1000;
const BLOCK_TO_FINALITY = 10;

const sleep = duration => new Promise(res => setTimeout(res, duration));

exports.checkBalanceAndApproveEthManger = async function (
  ethUserPrivateKey,
  erc20TokenAddress,
  amount
) {
  let ethUserAccount = web3.eth.accounts.privateKeyToAccount(ethUserPrivateKey);
  web3.eth.accounts.wallet.add(ethUserAccount);
  web3.eth.defaultAccount = ethUserAccount.address;

  let erc20Contract = new web3.eth.Contract(ERC20.abi, erc20TokenAddress);
  let balance = await erc20Contract.methods.balanceOf(ethUserAccount.address).call();

  if (balance < amount) {
    throw new Error('Your balance not enough to transfer!');
  }

  // console.log(balance);

  await erc20Contract.methods.approve(ethBridgeAddress, amount).send({
    from: ethUserAccount.address,
    gas: process.env.ETH_GAS_LIMIT,
    gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1))
  });
  return;
};

exports.lockERC20Token = async function (
  erc20TokenAddress,
  ethUserPrivateKey,
  amount,
  hmyUserAddress
) {
  try {
    let ethUserAccount = web3.eth.accounts.privateKeyToAccount(ethUserPrivateKey);
    web3.eth.accounts.wallet.add(ethUserAccount);
    web3.eth.defaultAccount = ethUserAccount.address;

    let transaction = await ethBridgeContract.methods
      .lockToken(erc20TokenAddress, amount, hmyUserAddress)
      .send({
        from: ethUserAccount.address,
        gas: process.env.ETH_GAS_LIMIT,
        gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1))
      });

    return transaction.events.Locked;
  } catch (err) {
    throw err;
  }
};

exports.lockETH = async function (ethUserPrivateKey, amount, hmyUserAddress) {
  try {
    let ethUserAccount = web3.eth.accounts.privateKeyToAccount(ethUserPrivateKey);
    web3.eth.accounts.wallet.add(ethUserAccount);
    web3.eth.defaultAccount = ethUserAccount.address;

    let transaction = await ethBridgeContract.methods.lockEth(amount, hmyUserAddress).send({
      from: ethUserAccount.address,
      value: amount,
      gas: process.env.ETH_GAS_LIMIT,
      gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1))
    });

    return transaction.events.Locked;
  } catch (err) {
    throw err;
  }
};

exports.checkBlock = async function (blockNumber) {
  while (true) {
    let currentBlock = await web3.eth.getBlockNumber();
    if (currentBlock <= blockNumber + BLOCK_TO_FINALITY) {
      console.log(
        `Currently at block ${currentBlock}, waiting for block ${blockNumber} to be confirmed`
      );
      await sleep(AVG_BLOCK_TIME);
    } else {
      return;
    }
  }
};

exports.getLatestPriceERC = async oracleAddress => {
  try {
    let result = await ethBridgeContract.methods.getLatestPrice(oracleAddress).call();
    // console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// this.getLatestPriceERC('0xaF540Ca83c7da3181778e3D1E11A6137e7e0085B');
