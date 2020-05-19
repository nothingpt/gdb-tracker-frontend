import React, { useState } from "react";
import styled from "styled-components";

import GdbList from "./GdbList";
import Filter from "./Filter";
import Pagination from './Pagination'

import SearchContext from '../SearchContext';
import StatusContext from '../StatusContext';
import ProjectContext from '../ProjectContext';
import SearchRFAContext from '../SearchRFAContext';
import OffsetContext from '../OffsetContext';
import PageContext from '../PagesContext';

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
  const [ value, setValue ] = useState('project');
  const [ status, setStatus ] = useState('');
  const [ project, setProject ] = useState('');
  const [ rfaID, setRfaID ] = useState('');
  const [ offset, setOffset ] = useState(1);
  const [ pages, setPages ] = useState(0);

  return (
    <Content>
      <SearchContext.Provider value={{ value, setValue}}>
        <StatusContext.Provider value={{ status, setStatus }}>
          <ProjectContext.Provider value={{ project, setProject }}>
            <SearchRFAContext.Provider value={{ rfaID, setRfaID }}>
              <OffsetContext.Provider value={{ offset, setOffset }}>
                <PageContext.Provider value={{ pages, setPages }}>
                  <Filter/>
                  <div className='gdbList-container'>
                    <GdbList />
                    <Pagination/>
                  </div>
                </PageContext.Provider>
              </OffsetContext.Provider>
            </SearchRFAContext.Provider>
          </ProjectContext.Provider>
        </StatusContext.Provider>
      </SearchContext.Provider>
    </Content>
  );
}

export default Home;
