import { useState } from 'react';
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost';

const PROJECTS_QUERY = gql`
  query PROJECTS_QUERY {
    projects
  }
`

const STATUS_QUERY = gql`
  query STATUS_QUERY {
    status
  }
`;

export default function useProjectsAndStatus() {
  const res1 = useQuery(PROJECTS_QUERY);
  const res2 = useQuery(STATUS_QUERY);

  return [ res1, res2];
}

