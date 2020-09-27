import store from 'store';
import { setSender, setReceiver } from 'store/actions.js';
export const connectMathWallet = async isSender => {
  let isMathWallet = window.harmony && window.harmony.isMathWallet;
  if (isMathWallet) {
    let mathwallet = window.harmony;
    mathwallet.getAccount().then(async account => {
      isSender
        ? store.dispatch(setSender(account.address))
        : store.dispatch(setReceiver(account.address));
    });
  }
};
