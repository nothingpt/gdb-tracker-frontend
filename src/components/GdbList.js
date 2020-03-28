import React from 'react';
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import styled from "styled-components";

const GDBS_QUERY = gql`
  query gdbs {
    gdbs {
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
  .results {
    border-radius: 16px;
    background: #f2d9d4;
    min-height: calc(100vh-250px);

    .results-header {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      color: #fe6b21;
      grid-template-areas:
      "project rfaid description created updated notes"

      .results-header-project {
        font-family: "Nunito";
        font-size: 1rem;
        padding-left: 4px;
        padding-top: 2px;
      }
    }

    .results-content {
      font-family: 'Nunito';
      font-size: 1rem;
      color: #52A3CC;
    }
  }
`;

const GdbList = () => {
  const { loading, error, data } = useQuery(GDBS_QUERY);

  if (error) return <p> an error occurred </p>;
  if (loading) return <h4>...loading...</h4>;

  if (data && data.gdbs) {
    const { gdbs } = data;
    return (
      <>
        <Gdbs>
          <div className="results">
            <div className="results-header">
              <span className="results-header-project">Project</span>
              <span>RFA ID</span>
              <span>Description</span>
              <span>Created @</span>
              <span>Updated @</span>
              <span>Notes</span>
            </div>
            <div className="results-content">
              {gdbs.map(gdb => (
                <div key={gdb.rfaid}>
                  <span>{gdb.project}</span>
                  <span>{gdb.rfaid}</span>
                  <span>{gdb.description}</span>
                  <span>{gdb.created}</span>
                  <span>{gdb.updated}</span>
                  {gdb.notes.length>0 ? 'Y': 'N'}
                </div>
              ))}
            </div>
          </div>
        </Gdbs>
      </>
    );
  }
}

export default GdbList;
