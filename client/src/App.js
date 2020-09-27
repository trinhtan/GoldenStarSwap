import React from 'react';
import './App.css';
import { Layout } from 'antd';
import MainSwap from 'pages/MainSwap';
import Logo from 'icons/5.png';
import './App.css';
const { Header, Footer } = Layout;
function App() {
  return (
    <Layout className='style-layout'>
      <div>
        <div id='stars'></div>
        <div id='stars2'></div>
        <div id='stars3'></div>
        <div id='title'></div>
      </div>
      <Header className='style-header'>
        <div className='logo'>
          <img src={Logo} alt='logo'></img>
          {/* GoldenStar Swap */}
        </div>
      </Header>
      <MainSwap></MainSwap>
      <Footer className='style-footer'></Footer>
    </Layout>
  );
}

export default App;
