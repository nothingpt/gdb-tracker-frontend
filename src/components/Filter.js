import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import styled from "styled-components";

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
    margin-right: 0.5rem;
    &::before {
      content: "order by";
      border-bottom: 1px solid red;
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
        <select id="project-select">
          <option defaultValue value="">
            Select a Project
          </option>
          {dataProjects.projects.map(project => (
            <option value={project} key={project}>
              {project}
            </option>
          ))}
        </select>
        <select id="status-select">
          <option defaultValue value="">
            Select a Status
          </option>
          {dataStatus.status.map(s => (
            <option value={s} key={s}>
              {s}
            </option>
          ))}
        </select>
        <input id="rfaid-input" placeholder="search a RFA ID" />
        <div className="orderBy-select">
          <select id="orderBy-select">
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
