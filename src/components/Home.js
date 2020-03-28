import React from "react";
import styled from "styled-components";

import GdbList from "./GdbList";
import Filter from "./Filter";

import "../App.css";

const Content = styled.div`
  display: grid;
  max-width: 70vw;
  margin: 0 auto;
  max-height: calc(100vh - 200px);
  grid-template-rows: auto 1fr;
  grid-gap: 4px;
`;

const Home = () => (
  <Content>
    <Filter />
    <GdbList />
  </Content>
);

export default Home;
