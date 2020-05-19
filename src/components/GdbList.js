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
import OffsetContext from '../OffsetContext';
import PageContext from '../PagesContext';

const GDBS_QUERY = gql`
  query gdbs ($sort: String, $project: String, $status: String, $searchRFA: String, $offset: Int) {
    gdbs (sort: $sort, project: $project, status: $status, searchRFA: $searchRFA, offset: $offset) {
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
`; //totalCountFilter

const TOTAL_COUNT_QUERY = gql`
  query TOTAL_COUNT_QUERY ($project: String, $status: String, $searchRFA: String) {
    totalCountFilter (project: $project, status: $status, searchRFA: $searchRFA)
  }
`;

const TOTAL_GDBS_QUERY = gql`
  query TOTAL_GDBS_QUERY {
    getTotalGDBs
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

const descStyle = {
  borderLeft: '1px solid #52A3CC',
  paddingLeft: 4 + 'px'
}

const GdbList = () => {
  const { value } = useContext(Contexto);
  const { status } = useContext(StatusContext);
  const { project } = useContext(ProjectContext);
  const { rfaID } = useContext(SearchRFAContext);
  const { offset } = useContext(OffsetContext);
  const { pages, setPages} = useContext(PageContext);

  const {loading: loadingTotal, error: errorTotal, data: dataTotal} = useQuery(TOTAL_GDBS_QUERY);

  const { loading, error, data, refetch } = useQuery(GDBS_QUERY, {
    variables: {
      sort: value,
      status: status,
      project: project,
      searchRFA: rfaID,
      offset: offset
    },
  });

  const { loading: loadingTotalCount, error: errorTotalCount, data: dataTotalCount, refetch: refetchTotal } = useQuery(TOTAL_COUNT_QUERY, {
    variables: {
      status: status,
      project: project,
      searchRFA: rfaID,
    },
  });

  useEffect(() => {
    // TODO: Implement debounce (lodash)
    refetch();
    refetchTotal();
  }, [value, status, project, rfaID]);

  if (error) return <p> an error occurred </p>;
  if (errorTotal) return <p>An error has occurred</p>
  if (loading) return <h4>...loading...</h4>;
  if (loadingTotal) return <h4>...loading...</h4>

  if (dataTotal && dataTotal.getTotalGDBs) {
    setPages(Math.ceil(dataTotal.getTotalGDBs / 35));
  }

  if (data && data.gdbs) {
    if (dataTotalCount && dataTotalCount.totalCountFilter) {
      setPages(Math.ceil(dataTotalCount.totalCountFilter / 35));
    }
    const { gdbs } = data;
    return (
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
            <div className="tooltip results-content">
              <span className='tooltiptext'>{gdb.description}</span>
              <span className='results-content' style={descStyle}>
                {gdb.description.substring(0, 50)}
              </span>
            </div>
            <div className='tooltip results-content'>
              <span className='tooltiptext-status'>{gdb.status}</span>
              <Link to={{
                pathname: '/gdb',
                state: {
                  gdb
                }
              }} className='results-content link'>{gdb.status.substring(0, 15)}</Link>
            </div>
            <span className='results-content'>{moment(gdb.updated).format('DD-MM-YYYY')}</span>
            {gdb.notes.length>0 ? <span className='results-content'>V</span>:<span className='results-content'></span>}
            </React.Fragment>
          ))}
        </Gdbs>
    );
  }
}

export default GdbList;
