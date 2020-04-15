import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import styled from "styled-components";

import Contexto from '../SearchContext'
import StatusContext from '../StatusContext'
import ProjectContext from '../ProjectContext'
import SearchRFAContext from '../SearchRFAContext'

const STATUS_QUERY = gql`
  query STATUS_QUERY {
    status
  }
`;

const PROJECTS_QUERY = gql`
  query PROJECTS_QUERY {
    projects
  }
`;

const FilterBox = styled.div`
  width: 70vw;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1rem;
  font-family: 'Nunito';

  select {
    color: #B4836A;
    border: none;
    border-radius: 4px;
    height: 2rem;
    line-height: 2rem;
  }

  .orderBy-select {
    justify-self: end;
    margin-right: 0.5rem;
    float: right;
    &::before {
      content: "order by";
      color: #B4836A;
      font-size: 0.7rem;
      float: left;
      border-bottom: 1px solid #fe6b21;
    }
  }

  input {
    color: #B4836A;
    border: none;
    border-radius: 4px;
    padding-left: 0.5rem;
    &::placeholder {
      color: #EEDBD7;
      font-style: italic;
    }
  }

`;

const Filter = () => {
  const { value, setValue } = useContext(Contexto);
  const { status, setStatus } = useContext(StatusContext);
  const { project, setProject } = useContext(ProjectContext);
  const { rfaID, setRfaID } = useContext(SearchRFAContext);

  const {
    loading: loadingStatus,
    error: errorStatus,
    data: dataStatus
  } = useQuery(STATUS_QUERY);

  const {
    loading: loadingProjects,
    error: errorProjects,
    data: dataProjects
  } = useQuery(PROJECTS_QUERY);

  const handleOrder = (e) => {
    e.preventDefault();
    setValue(e.target.value);
  }

  const handleStatus = (e) => {
    setStatus(e.target.value);
  }

  const handleProject = (e) => {
    setProject(e.target.value);
  }

  const handleRfaId = (e) => {
    setRfaID(e.target.value);
  }

  if (loadingStatus || loadingProjects) return <p>... Loading ... </p>;
  if (errorStatus || errorProjects) return <p>An error occurred</p>;

  if (
    dataStatus &&
    dataStatus.status &&
    dataProjects &&
    dataProjects.projects
  ) {
    return (
      <FilterBox>
        <select id="project-select" onChange={handleProject}>
          <option defaultValue value="">
            All
          </option>
          {dataProjects.projects.map(project => (
            <option value={project} key={project} >
              {project}
            </option>
          ))}
        </select>
        <select id="status-select" onChange={handleStatus}>
          <option defaultValue value="">
            All
          </option>
          <option value="NotClosed">Not Closed</option>
          {dataStatus.status.map(s => (
            <option value={s} key={s}>
              {s}
            </option>
          ))}
        </select>
        <input id="rfaid-input" placeholder="search a RFA ID" onChange={handleRfaId} />
        <div className="orderBy-select">
          <select id="orderBy-select" onChange={handleOrder}>
            <option value="project" defaultValue>
              Project
            </option>
            <option value="status">Status</option>
            <option value="created">created at</option>
            <option value="updated">updated at</option>
          </select>
        </div>
      </FilterBox>
    );
  }
};

export default Filter;
