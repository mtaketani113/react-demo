import React from 'react';
import {Top, Customer} from './components/index';
import './App.css';

import {BrowserRouter, Routes , Route} from "react-router-dom";

import {HeaderMenu, FooterMenu} from './components/index';

function App() {
  return (
    <React.Fragment>
      <HeaderMenu/>
      <BrowserRouter>
        <Routes >
          <Route path="/" element={<Top/>} />
          <Route path="/customer" element={<Customer/>} />
        </Routes >
      </BrowserRouter>
      <FooterMenu/>
    </React.Fragment>
  );
}

export default App;
