import React from 'react';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { setSender, setReceiver } from 'store/actions';
function LogoutButton({ isSender }) {
  const dispatch = useDispatch();
  const logout = () => {
    isSender ? dispatch(setSender(null)) : dispatch(setReceiver(null));
  };

  return (
    <Button shape='round' size='small' onClick={() => logout()}>
      Logout
    </Button>
  );
}

export default LogoutButton;
