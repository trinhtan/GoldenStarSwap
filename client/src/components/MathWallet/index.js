import React from 'react';
import { Button } from 'antd';
import { connectMathWallet } from 'utils/connectMathWallet';
import mathWallet from 'icons/mathWallet.png';
function MathWallet({ isSender }) {
  return (
    <Button type='dashed' shape='round' size='large' onClick={() => connectMathWallet(isSender)}>
      <img src={mathWallet} width={'120px'} alt='mathwallet'></img>
    </Button>
  );
}

export default MathWallet;
