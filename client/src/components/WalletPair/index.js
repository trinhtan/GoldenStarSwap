import React from 'react';
import { Row, Col } from 'antd';
import { useSelector } from 'react-redux';
import MetaMaskWallet from 'components/MetaMaskWallet';
import MathWallet from 'components/MathWallet';
import LogoutButton from 'components/LogoutButton';
import Token from 'constants/Token';
import OneToken from 'icons/harmony.png';
import './index.css';

function WalletPair() {
  const senderAddress = useSelector(state => state.senderAddress);
  const receiverAddress = useSelector(state => state.receiverAddress);
  const senderBalance = useSelector(state => state.senderBalance);
  const receiverBalance = useSelector(state => state.receiverBalance);
  const senderToken = useSelector(state => state.senderToken);
  const token = Token.find(e => e.address === senderToken);
  let sender;
  senderAddress
    ? (sender = (
        <div>
          {senderAddress} <LogoutButton isSender={true} />
          <br />
          <img src={token.src} width={'20px'} alt={token.name}></img>
          {'  ' + senderBalance}
        </div>
      ))
    : (sender = <MetaMaskWallet isSender={true}></MetaMaskWallet>);

  let receiver;
  receiverAddress
    ? (receiver = (
        <div>
          {receiverAddress} <LogoutButton isSender={false} />
          <br />
          <img src={OneToken} width={'20px'} alt={token.name}></img>
          {'  ' + receiverBalance}
        </div>
      ))
    : (receiver = <MathWallet isSender={false}></MathWallet>);

  return (
    <div className='wallet-pair'>
      <Row gutter={[8, 8]}>
        <Col span={9} className='wallet-left'>
          <div className='wallet-type'>Ethereum</div>
          {sender}
        </Col>

        <Col span={9} offset={6} className='wallet-right'>
          <div className='wallet-type'>Harmony</div>
          {receiver}
        </Col>
      </Row>
    </div>
  );
}

export default WalletPair;
