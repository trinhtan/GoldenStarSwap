import { Layout } from 'antd';
import React from 'react';
import SwapPair from 'components/SwapPair';
import WalletPair from 'components/WalletPair';
import ReceiverSwap from 'components/ReceiverSwap';
import './index.css';
const { Content } = Layout;

function MainSwap() {
  return (
    <Layout className='style-main-swap'>
      <Content>
        <SwapPair />
        <ReceiverSwap />
        <WalletPair />
      </Content>
    </Layout>
  );
}

export default MainSwap;
