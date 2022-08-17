import React from 'react';
import {Customer} from './components/index';
import './App.css';

import {BrowserRouter, Routes , Route} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes >
        <Route path="/customer" element={<Customer/>} />
      </Routes >
    </BrowserRouter>
  );
}

export default App;
