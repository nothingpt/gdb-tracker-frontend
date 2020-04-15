import React from "react";
import { Route } from "react-router-dom";
import { createGlobalStyle } from 'styled-components';

import Home from "./components/Home";
import AddGDB from "./components/AddGDB";
import Header from "./components/Header";
import Gdb from './components/Gdb';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Nunito&display=swap');
  
  body {
    background: #D4EDF2;
    max-height: 100vh;
  }
`;

const App = () => {
  return (
    <>
      <GlobalStyle />
      <Header />
      <Route path="/" exact component={Home} />
      <Route path="/add" component={AddGDB} />
      <Route path="/gdb/" component={Gdb} />
    </>
  );
};

export default App;
