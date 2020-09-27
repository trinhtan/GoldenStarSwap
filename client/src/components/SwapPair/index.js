import React from 'react';
import { Select, Button, Input, Col, Row, InputNumber, Divider } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/fontawesome-free-solid';
import { useDispatch, useSelector } from 'react-redux';
import Token from 'constants/Token.js';
import OneToken from 'icons/harmony.png';
import { setSenderToken, setSendAmount } from 'store/actions';
import './index.css';
const { Option } = Select;

function SwapPair() {
  const dispatch = useDispatch();
  const senderBalance = useSelector(state => state.senderBalance);
  const receiveAmount = useSelector(state => state.receiveAmount);
  const sendAmount = useSelector(state => state.sendAmount);
  const changeToken = value => {
    let tokenSender = Token.find(e => e.name === value);
    dispatch(setSenderToken(tokenSender.address, tokenSender.oracleAddress));
  };

  const changeAmout = value => {
    dispatch(setSendAmount(value));
  };

  return (
    <div className='swap-pair'>
      {/* <Divider orientation='left'></Divider> */}
      <Input.Group size='large'>
        <Row gutter={16}>
          <Col xs={2} sm={4} md={6} lg={8} xl={10}>
            <Divider orientation='center'>Have</Divider>
            <Row className='text-align-center'>
              <Col className='margin-right-10'>
                <Select defaultValue='LINK' onChange={changeToken} style={{ width: 120 }}>
                  {Token.map((e, i) => (
                    <Option key={i} value={e.name}>
                      <img src={e.src} width={'20px'} alt='e.name'></img> {'  ' + e.name}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col>
                <InputNumber
                  style={{
                    width: 250,
                    textAlign: 'center'
                  }}
                  onChange={changeAmout}
                  size='large'
                  value={sendAmount}
                  className='input-border-round'
                ></InputNumber>
                <div>
                  <span>Max: {senderBalance}</span>
                </div>
              </Col>
            </Row>
          </Col>

          <Col xs={20} sm={16} md={12} lg={8} xl={4} className='style-button-swap'>
            <Button shape='round'>
              <FontAwesomeIcon icon={faExchangeAlt} />
            </Button>
          </Col>

          <Col xs={2} sm={4} md={6} lg={8} xl={10}>
            <Divider orientation='center'>Maybe</Divider>
            <Row className='text-align-center'>
              <Col className='margin-right-10'>
                <Select defaultValue='one' style={{ width: 120 }}>
                  <Option value='one'>
                    <img src={OneToken} width={'20px'} alt='one' />
                    {' ONE'}
                  </Option>
                </Select>
              </Col>
              <Col>
                <InputNumber
                  style={{
                    width: 250,
                    textAlign: 'center'
                  }}
                  step='0.001'
                  size='large'
                  disabled
                  bordered={true}
                  value={receiveAmount}
                ></InputNumber>
              </Col>
            </Row>
          </Col>
        </Row>
      </Input.Group>
    </div>
  );
}

export default SwapPair;
