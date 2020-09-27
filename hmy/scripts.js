require('dotenv').config();
const { Harmony } = require('@harmony-js/core');
const { ChainID, ChainType } = require('@harmony-js/utils');

const hmy = new Harmony(process.env.TESTNET_0_URL, {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyTestnet
});

const GAS_LIMIT = 6721900;
const GAS_PRICE = 1000000000;

const options = {
  gasLimit: GAS_LIMIT,
  gasPrice: GAS_PRICE
};

const HmyBridge = require('./build/contracts/HmyBridge.json');
const hmyBridgeAddress = HmyBridge.networks['2'].address;

exports.unlockOne = async function (amountUSD, receiver, receiptId) {
  try {
    const hmyBridgeContract = hmy.contracts.createContract(HmyBridge.abi, hmyBridgeAddress);
    hmyBridgeContract.wallet.addByPrivateKey(process.env.HMY_OPERATOR_PRIVATE_KEY);

    const unlockTx = hmy.transactions.newTx({
      to: hmyBridgeAddress
    });

    await hmyBridgeContract.wallet.signTransaction(unlockTx);
    let result = await hmyBridgeContract.methods
      .unlockOne(amountUSD, receiver, receiptId)
      .send(options);
    console.log(result);
    return;
  } catch (err) {
    throw err;
  }
};

exports.lockONE = async function (hmyUserPrivateKey, erc20TokenAddress, amountONE, ethUserAddress) {
  try {
    const hmyBridgeContract = hmy.contracts.createContract(HmyBridge.abi, hmyBridgeAddress);
    hmyBridgeContract.wallet.addByPrivateKey(hmyUserPrivateKey);

    const lockTx = hmy.transactions.newTx({
      to: hmyBridgeAddress
    });

    await hmyBridgeContract.wallet.signTransaction(lockTx);

    let result = await hmyBridgeContract.methods
      .lockOne(erc20TokenAddress, amountONE, ethUserAddress)
      .send({ ...options, value: amountONE });
    console.log(
      result.events['0x154be75783ccf7f70c837ce99a8c0fa73b889d0426b6fa8779eb4cfede898792']
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.getOneBalance = async function (hmyUserAddress) {
  try {
    let data = await hmy.blockchain.getBalance({
      address: hmyUserAddress
    });
    let result = parseInt(data.result);
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
};

exports.getLatestPrice = async function (oracleAddress) {
  try {
    const hmyBridgeContract = hmy.contracts.createContract(HmyBridge.abi, hmyBridgeAddress);
    let result = await hmyBridgeContract.methods.getLatestPrice(oracleAddress).call(options);
    console.log(parseInt(result));
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.stakeForContract = async function (amount) {
  try {
    const sender = hmy.wallet.addByPrivateKey(process.env.HMY_OPERATOR_PRIVATE_KEY);
    const txn = hmy.transactions.newTx({
      to: 'one1f9wwlhrd2arm0hwukuut989489sv6hpxp5xt3k',
      value: amount,
      gasLimit: '210000',
      shardID: 0,
      toShardID: 0,
      gasPrice: new hmy.utils.Unit('100').asGwei().toWei()
    });

    const signedTxn = await hmy.wallet.signTransaction(txn);
    const [sentTxn, txnHash] = await signedTxn.sendTransaction();
    const confiremdTxn = await sentTxn.confirm(txnHash);

    // if the transactino is cross-shard transaction
    if (!confiremdTxn.isCrossShard()) {
      if (confiremdTxn.isConfirmed()) {
        console.log('--- Result ---');
        console.log('');
        console.log('Normal transaction');
        console.log(`${txnHash} is confirmed`);
        console.log('');
        process.exit();
      }
    }
    if (confiremdTxn.isConfirmed() && confiremdTxn.isCxConfirmed()) {
      console.log('--- Result ---');
      console.log('');
      console.log('Cross-Shard transaction');
      console.log(`${txnHash} is confirmed`);
      console.log('');
      process.exit();
    }
    return;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// this.getOneBalance('0xc162199cDaeAa5a82f00651dd4536F5d2d4277C5');
// this.stakeForContract('10');
// this.getOneBalance('one1f9wwlhrd2arm0hwukuut989489sv6hpxp5xt3k');
// this.unlockOne(
//   '1094000000000000000000000000',
//   '0xc162199cDaeAa5a82f00651dd4536F5d2d4277C5',
//   '0xb6674e75aa0c8c365ed32d3a8f9cef70cab5e14bdd1bc3688f37ce9df096f4eb'
// );
// this.getLatestPrice('0x05d511aAfc16c7c12E60a2Ec4DbaF267eA72D420');
// this.lockONE(
//   '0x1f054c21a0f57ebc402c00e14bd1707ddf45542d4ed9989933dbefc4ea96ca68',
//   '0xad6d458402f60fd3bd25163575031acdce07538d',
//   '10000000000000000000',
//   '0x02610D24fd42f1237c584b6A699727aBAE7cC04e'
// );
