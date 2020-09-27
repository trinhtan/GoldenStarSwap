const ERC20 = require('../eth/contracts/IERC20.json');
const EthBridge = require('../eth/contracts/EthBridge.json');
const Web3 = require('web3');
const BN = require('big.js');
const { Harmony } = require('@harmony-js/core');
const { ChainID, ChainType } = require('@harmony-js/utils');
const HmyBridge = require('../hmy/contracts/HmyBridge.json');
require('dotenv').config();

const options = {
  gasLimit: 6721900,
  gasPrice: 1000000000
};

const hmy = new Harmony('https://api.s0.b.hmny.io', {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyTestnet
});

export const balanceOf = async (tokenAddress, walletAddress) => {
  const web3 = new Web3(window.ethereum);
  let balance;
  if (tokenAddress === '0x0000000000000000000000000000000000000001') {
    balance = web3.eth.getBalance(walletAddress);
  } else {
    const erc20 = new web3.eth.Contract(ERC20.abi, tokenAddress);
    balance = await erc20.methods.balanceOf(walletAddress).call();
  }
  return balance;
};

export const approve = async (walletAddress, tokenAddress, amount) => {
  const web3 = new Web3(window.ethereum);
  const erc20 = new web3.eth.Contract(ERC20.abi, tokenAddress);
  let ethBridgeAddress = EthBridge.networks['3'].address;
  await erc20.methods.approve(ethBridgeAddress, amount).send({ from: walletAddress });
};

export const transferERC20ToONE = async (
  ethUserAddress,
  erc20TokenAddress,
  amount,
  receiverAddress
) => {
  const web3 = new Web3(window.ethereum);
  const ethBridgeContract = new web3.eth.Contract(EthBridge.abi, EthBridge.networks['3'].address);
  let hmyUserAddress = await hmy.crypto.getAddress(receiverAddress).checksum;

  let transaction = await ethBridgeContract.methods
    .lockToken(erc20TokenAddress, amount, hmyUserAddress)
    .send({
      from: ethUserAddress,
      gas: process.env.ETH_GAS_LIMIT,
      gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1))
    });
  let amountUSD = transaction.events.Locked.returnValues['5'];
  let receiptId = transaction.events.Locked.transactionHash;

  const hmyBridgeContract = hmy.contracts.createContract(
    HmyBridge.abi,
    HmyBridge.networks['2'].address
  );
  hmyBridgeContract.wallet.addByPrivateKey(process.env.REACT_APP_HMY_OPERATOR_PRIVATE_KEY);

  const unlockTx = hmy.transactions.newTx({
    to: HmyBridge.networks['2'].address
  });

  await hmyBridgeContract.wallet.signTransaction(unlockTx);
  await hmyBridgeContract.methods.unlockOne(amountUSD, hmyUserAddress, receiptId).send(options);
};

export const transferETHToONE = async (ethUserAddress, amount, receiverAddress) => {
  const web3 = new Web3(window.ethereum);
  const ethBridgeContract = new web3.eth.Contract(EthBridge.abi, EthBridge.networks['3'].address);
  let hmyUserAddress = await hmy.crypto.getAddress(receiverAddress).checksum;

  let transaction = await ethBridgeContract.methods.lockEth(amount, hmyUserAddress).send({
    from: ethUserAddress,
    value: amount,
    gas: process.env.ETH_GAS_LIMIT,
    gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1))
  });
  let amountUSD = transaction.events.Locked.returnValues['5'];
  let receiptId = transaction.events.Locked.transactionHash;

  const hmyBridgeContract = hmy.contracts.createContract(
    HmyBridge.abi,
    HmyBridge.networks['2'].address
  );
  hmyBridgeContract.wallet.addByPrivateKey(process.env.REACT_APP_HMY_OPERATOR_PRIVATE_KEY);

  const unlockTx = hmy.transactions.newTx({
    to: HmyBridge.networks['2'].address
  });

  await hmyBridgeContract.wallet.signTransaction(unlockTx);
  await hmyBridgeContract.methods.unlockOne(amountUSD, hmyUserAddress, receiptId).send(options);
};

export const getLatestPriceONE = async oracleAddress => {
  try {
    const hmyBridgeContract = hmy.contracts.createContract(
      HmyBridge.abi,
      HmyBridge.networks['2'].address
    );
    let result = await hmyBridgeContract.methods.getLatestPrice(oracleAddress).call(options);
    return parseInt(result);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getLatestPriceERC = async oracleAddress => {
  try {
    const web3 = new Web3(window.ethereum);
    const ethBridgeContract = new web3.eth.Contract(EthBridge.abi, EthBridge.networks['3'].address);
    let result = await ethBridgeContract.methods.getLatestPrice(oracleAddress).call();
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
