import React from 'react';
import { Button } from 'antd';
import { connectMetamask } from 'utils/connectMetaMask';
import metamask from 'icons/metamask.svg';
function MetaMask({ isSender }) {
  return (
    <Button type='dashed' shape='round' size='large' onClick={() => connectMetamask(isSender)}>
      <img src={metamask} width={'30px'} alt='metamask'></img>
    </Button>
  );
}

export default MetaMask;
