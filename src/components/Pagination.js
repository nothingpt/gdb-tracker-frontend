import React, { useContext } from 'react'
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAngleLeft, faAngleRight} from '@fortawesome/free-solid-svg-icons'

import OffsetContext from '../OffsetContext';
import PageContext from '../PagesContext';

const TOTAL_GDBS_QUERY = gql`
  query TOTAL_GDBS_QUERY {
    getTotalGDBs
  }
`;

const Pagination = () => {
  const { offset, setOffset } = useContext(OffsetContext);
  const { pages, setPages} = useContext(PageContext);

  const {loading, error, data} = useQuery(TOTAL_GDBS_QUERY);

  const handlePrevious = () => {
    if (offset > 1) {
      setOffset(offset - 1);
    }
  }

  const handleNext = () => {
    if (offset !== pages) {
      setOffset(offset + 1);
    }
  }

  const hasNext = () => {
    return offset < pages;
  }

  if (loading) return <p>...loading...</p>
  if (error) return <p>An error has occurred.</p>

  if (data && data.getTotalGDBs) {
    return (
      <div className="pagination-container">
      <span><FontAwesomeIcon icon={faAngleLeft} onClick={handlePrevious} className= {offset !== 1 ? 'prev-next-icons':'prev-next-icons-disabled'} fixedWidth /></span>
        <span className='pagination-middle'>{offset} / {pages}</span>
        <span><FontAwesomeIcon icon={faAngleRight} onClick={handleNext} className={hasNext() ? 'prev-next-icons':'prev-next-icons-disabled'} fixedWidth /></span>
      </div>
    )
  }
}

export default Pagination;
