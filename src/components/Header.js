import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Header_Elem = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;

  .logo {
    padding-left: 1rem;
    a, a:visited, a:hover {
      color: #FE6B21;
      font-family: 'Nunito';
      font-size: 2rem; 
    }
  }

  .add {
    justify-self: end;
    padding-right: 1rem;
  }

  a, a:hover, a:visited {
    color: #FE6B21;
    font-family: 'Nunito';
    font-size: 1.5rem;
    text-decoration: none;
  }
`;

const Header = () => (
  <Header_Elem>
    <div className="logo"><Link to="/">GDB Tracker</Link></div>
    <div className="add"><Link to="/add">add</Link></div>
  </Header_Elem>
)

export default Header;
