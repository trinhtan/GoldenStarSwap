import { balanceOf, getLatestPriceERC, getLatestPriceONE } from 'utils/erc20';
import { Harmony } from '@harmony-js/core';
import { ChainID, ChainType, fromWei, hexToNumber, Units } from '@harmony-js/utils';

// const GAS_LIMIT = 6721900;
// const GAS_PRICE = 1000000000;
// const options = {
//   gasPrice: GAS_PRICE,
//   gasLimit: GAS_LIMIT
// };
const hmy = new Harmony('https://api.s0.b.hmny.io', {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyTestnet
});

export const SET_SENDER = 'SET_SENDER';
export const setSender = address => async (dispatch, getState) => {
  const state = getState();
  const senderToken = state.senderToken;
  dispatch({
    type: SET_SENDER,
    address
  });
  if (address) {
    let balance = await balanceOf(senderToken, address);
    dispatch(setSenderBalance(balance));
  }
};

export const SET_RECEIVER = 'SET_RECEIVER';
export const setReceiver = address => async dispatch => {
  dispatch({ type: SET_RECEIVER, address });
  if (address) {
    let res = await hmy.blockchain.getBalance({ address: address });
    let balance = parseFloat(fromWei(hexToNumber(res.result), Units.one)).toFixed(2);
    dispatch(setReceiverBalance(balance));
  }
};

export const SET_WEB3 = 'SET_WEB3';
export const setWeb3 = web3 => async dispatch => {
  dispatch({ type: SET_WEB3, web3 });
};

export const SET_SENDER_TOKEN = 'SET_SENDER_TOKEN';
export const SET_ORACLE_ADDRESS = 'SET_ORACLE_ADDRESS';
export const setSenderToken = (tokenAddress, oracleAddress) => async (dispatch, getState) => {
  dispatch({ type: SET_SENDER_TOKEN, tokenAddress });
  dispatch({ type: SET_ORACLE_ADDRESS, oracleAddress });
  const state = getState();
  const senderAddress = state.senderAddress;
  if (senderAddress) {
    let balance = await balanceOf(tokenAddress, senderAddress);
    dispatch(setSenderBalance(balance));
  }
};

export const SET_SENDER_BALANCE = 'SET_SENDER_BALANCE';
export const setSenderBalance = balance => async dispatch => {
  let newBalance = (balance / 10 ** 18).toFixed(2);
  dispatch({ type: SET_SENDER_BALANCE, balance: newBalance });
};

export const SET_RECEIVER_BALANCE = 'SET_RECEIVER_BALANCE';
export const setReceiverBalance = balance => async dispatch => {
  dispatch({ type: SET_RECEIVER_BALANCE, balance });
};

export const SET_SEND_AMOUNT = 'SET_SEND_AMOUNT';
export const SET_RECEIVE_AMOUNT = 'SET_RECEIVE_AMOUNT';
export const setSendAmount = sendAmount => async (dispatch, getState) => {
  const state = getState();
  let priceERC = await getLatestPriceERC(state.oracleAddress);
  let priceONE = await getLatestPriceONE('0x05d511aAfc16c7c12E60a2Ec4DbaF267eA72D420');

  let amount = (parseFloat(priceERC) * parseFloat(sendAmount)) / parseFloat(priceONE);
  console.log(amount.toFixed(3));
  dispatch({ type: SET_RECEIVE_AMOUNT, receiveAmount: amount.toFixed(3) });
  dispatch({ type: SET_SEND_AMOUNT, sendAmount });
};
