import React, { useState } from "react";
import styled from "styled-components";

import GdbList from "./GdbList";
import Filter from "./Filter";

import SearchContext from '../SearchContext';
import StatusContext from '../StatusContext';
import ProjectContext from '../ProjectContext';
import SearchRFAContext from '../SearchRFAContext';

import "../App.css";

const Content = styled.div`
  display: grid;
  max-width: 70vw;
  margin: 0 auto;
  max-height: calc(100vh - 200px);
  grid-template-rows: auto 1fr;
  grid-gap: 4px;
`;

const Home = () => {
  const [ value, setValue] = useState('project');
  const [ status, setStatus] = useState('');
  const [ project, setProject ] = useState('');
  const [ rfaID, setRfaID] = useState('');

  return (
    <Content>
      <SearchContext.Provider value={{ value, setValue}}>
        <StatusContext.Provider value={{ status, setStatus }}>
          <ProjectContext.Provider value={{ project, setProject }}>
            <SearchRFAContext.Provider value={{ rfaID, setRfaID }}>
              <Filter />
              <GdbList />
            </SearchRFAContext.Provider>
          </ProjectContext.Provider>
        </StatusContext.Provider>
      </SearchContext.Provider>
    </Content>
  );
}

export default Home;
