import * as actions from './actions';
const initialState = {
  web3: null,

  senderAddress: null,
  senderBalance: 0,
  senderType: '',
  senderToken: '0xb4f7332ed719Eb4839f091EDDB2A3bA309739521',
  sendAmount: 0,

  receiverAddress: null,
  receiverBalance: 0,
  receiverType: '',
  receiveAmount: 0
};
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_SENDER:
      return {
        ...state,
        senderAddress: action.address
      };
    case actions.SET_RECEIVER:
      return {
        ...state,
        receiverAddress: action.address
      };
    case actions.SET_WEB3:
      return {
        ...state,
        web3: action.web3
      };
    case actions.SET_SENDER_TOKEN:
      return {
        ...state,
        senderToken: action.tokenAddress
      };
    case actions.SET_ORACLE_ADDRESS:
      return {
        ...state,
        oracleAddress: action.oracleAddress
      };
    case actions.SET_SENDER_BALANCE:
      return {
        ...state,
        senderBalance: action.balance
      };
    case actions.SET_RECEIVER_BALANCE:
      return {
        ...state,
        receiverBalance: action.balance
      };

    case actions.SET_SEND_AMOUNT:
      return {
        ...state,
        sendAmount: action.sendAmount
      };

    case actions.SET_RECEIVE_AMOUNT:
      return {
        ...state,
        receiveAmount: action.receiveAmount
      };

    default:
      return state;
  }
};
export default rootReducer;
