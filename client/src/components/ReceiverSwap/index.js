import React, { useState } from 'react';
// import { Button, Input, Col, Row, Divider } from 'antd';
import { Button, Modal } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { approve, transferERC20ToONE, transferETHToONE } from 'utils/erc20.js';
import { setSender, setReceiver, setSendAmount } from '../../store/actions';
import Token from 'constants/Token.js';
import './index.css';

function ReceiverSwap() {
  const dispatch = useDispatch();

  const receiverAddress = useSelector(state => state.receiverAddress);
  const senderAddress = useSelector(state => state.senderAddress);
  const sendAmount = useSelector(state => state.sendAmount);
  const senderToken = useSelector(state => state.senderToken);
  const receiveAmount = useSelector(state => state.receiveAmount);
  let disabledBtn = !(senderAddress && receiverAddress);

  const token = Token.find(e => e.address === senderToken);

  const [loadingApprove, setLoadingApprove] = useState(false);
  const [statusApprove, setStatusApprove] = useState(true);
  const [statusTransfer, setStatusTransfer] = useState(false);

  const [visibleERC, setVisibleERC] = useState(false);
  const [visibleETH, setVisibleETH] = useState(false);
  const [loadingTransfer, setLoadingTransfer] = useState(false);

  const setVisible = async () => {
    if (senderToken !== '0x0000000000000000000000000000000000000001') {
      setVisibleERC(true);
    } else {
      setVisibleETH(true);
      setStatusTransfer(true);
    }
  };

  const approveERC20 = async () => {
    setLoadingApprove(true);
    await approve(senderAddress, senderToken, (sendAmount * 10 ** 18).toString());
    setStatusApprove(false);
    setStatusTransfer(true);
    setLoadingApprove(false);
  };

  const transferERC = async () => {
    setLoadingTransfer(true);
    await transferERC20ToONE(
      senderAddress,
      senderToken,
      (sendAmount * 10 ** 18).toString(),
      receiverAddress
    );
    dispatch(setSender(senderAddress));
    dispatch(setReceiver(receiverAddress));
    dispatch(setSendAmount(0));
    setVisibleERC(false);
    setStatusApprove(true);
    setStatusTransfer(false);
    setLoadingTransfer(false);
  };

  const transferETH = async () => {
    setLoadingTransfer(true);
    await transferETHToONE(senderAddress, (sendAmount * 10 ** 18).toString(), receiverAddress);
    dispatch(setSender(senderAddress));
    dispatch(setReceiver(receiverAddress));
    dispatch(setSendAmount(0));
    setVisibleETH(false);
    setStatusApprove(true);
    setStatusTransfer(false);
    setLoadingTransfer(false);
  };

  return (
    <div className='receiver-swap'>
      {/* <Divider orientation='right'>Receiver Address:</Divider> */}
      {/* <Row>
        <Col span={8} offset={14}>
          <Input
            className='receiver-address'
            size='large'
            disabled={true}
            value={receiverAddress}
          />
        </Col>
      </Row> */}
      <div className='button-swap'>
        <Button
          size='large'
          shape='round'
          className='btn-swap'
          disabled={disabledBtn}
          onClick={() => setVisible()}
        >
          <label className='swap-label'>Swap</label>{' '}
          {/* <FontAwesomeIcon className='swap-icon' icon={faExchangeAlt} /> */}
        </Button>
      </div>
      <Modal
        visible={visibleERC}
        title='Swap'
        // onOk={this.handleOk}
        onCancel={() => setVisibleERC(false)}
        footer={[
          <Button
            key='Approve'
            type='primary'
            disabled={!statusApprove}
            loading={loadingApprove}
            onClick={() => approveERC20()}
          >
            Approve
          </Button>,
          <Button
            key='Transfer'
            type='primary'
            disabled={!statusTransfer}
            loading={loadingTransfer}
            onClick={() => transferERC()}
          >
            Transfer
          </Button>
        ]}
      >
        <p>
          {statusApprove ? 'You must approve to send ' + token.name + ' ?' : ''}
          {statusTransfer
            ? 'Do you want transfer ' +
              sendAmount +
              ' ' +
              token.name +
              ' to ' +
              receiveAmount +
              ' ONE ?'
            : ''}
        </p>
      </Modal>
      <Modal
        visible={visibleETH}
        title='Swap'
        // onOk={this.handleOk}
        onCancel={() => setVisibleETH(false)}
        footer={[
          <Button
            key='Transfer'
            type='primary'
            // disabled={!statusTransfer}
            loading={loadingTransfer}
            onClick={() => transferETH()}
          >
            Transfer
          </Button>
        ]}
      >
        <p>
          {statusTransfer
            ? 'Do you want transfer ' +
              sendAmount +
              ' ' +
              token.name +
              ' to ' +
              receiveAmount +
              ' ONE ?'
            : ''}
        </p>
      </Modal>
    </div>
  );
}

export default ReceiverSwap;
