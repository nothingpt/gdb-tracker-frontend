import React, { useContext, useEffect } from 'react';
import { useQuery, refetch } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import styled from "styled-components";
import moment from 'moment';
import { Link } from 'react-router-dom';

import Contexto from '../SearchContext';
import StatusContext from '../StatusContext';
import ProjectContext from '../ProjectContext';
import SearchRFAContext from '../SearchRFAContext';

const GDBS_QUERY = gql`
  query gdbs ($sort: String, $project: String, $status: String, $searchRFA: String) {
    gdbs (sort: $sort, project: $project, status: $status, searchRFA: $searchRFA) {
      _id
      project
      rfaid
      description
      status
      notes {
        created
        note
      }
      created
      updated
    }
  }
`;

const Gdbs = styled.div`
  display: grid;
  /* grid-template-columns: repeat(6, 1fr); */
  grid-template-columns: auto auto 1fr auto auto auto;
  grid-template-rows: auto;
  margin: 0;
  padding: 0;
  
  > span {
    padding-right: 6px;
    padding-left: 6px;
    border-left: 1px solid #52A3CC;
  }

  > span:first-child {
    border-left: none;
  }

  > span:nth-child(6n+1) {
    border: none;
  }

  a, a:hover, a:visited {
    text-decoration: none
    padding-right: 6px;
    padding-left: 6px;
    border-left: 1px solid #52A3CC;
  }
`;

const GdbList = () => {
  const { value } = useContext(Contexto);
  const { status } = useContext(StatusContext);
  const { project } = useContext(ProjectContext);
  const { rfaID } = useContext(SearchRFAContext);

  const { loading, error, data, refetch } = useQuery(GDBS_QUERY, {
    variables: {
      sort: value,
      status: status,
      project: project,
      searchRFA: rfaID
    },
  });

  useEffect(() => {
    // TODO: Implement debounce (lodash)
    refetch()
  }, [value, status, project, rfaID]);

  if (error) return <p> an error occurred </p>;
  if (loading) return <h4>...loading...</h4>;

  if (data && data.gdbs) {
    const { gdbs } = data;
    return (
      <div className='gdbList-container'>
        <Gdbs>
          <span className='results-header results-header-project'>Project</span>
          <span className='results-header'>RFA ID</span>
          <span className='results-header'>Description</span>
          <span className='results-header'>Status</span>
          <span className='results-header'>Updated @</span>
          <span className='results-header results-header-notes'>Notes</span>
          {gdbs.map(gdb => (
            <React.Fragment key={gdb.rfaid}>
            <span className='results-content'>{gdb.project}</span>
            <span className='results-content'>{gdb.rfaid}</span>
            <span className='results-content'>{gdb.description}</span>
            <Link to={{
              pathname: '/gdb',
              state: {
                gdb
              }
            }} className='results-content'>{gdb.status}</Link>
            <span className='results-content'>{moment(gdb.updated).format('DD-MM-YYYY')}</span>
            {gdb.notes.length>0 ? <span className='results-content'>view</span>:<span className='results-content'></span>}
            </React.Fragment>
          ))}
        </Gdbs>
      </div>
    );
  }
}

export default GdbList;
