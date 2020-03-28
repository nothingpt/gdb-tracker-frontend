import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { BrowserRouter } from 'react-router-dom';

import './react-datepicker.min.css';
import './index.css';
import App from './App';

const client = new ApolloClient({
  uri: 'http://localhost:7777'
});

ReactDOM.render(<ApolloProvider client={ client }><BrowserRouter><App /></BrowserRouter></ApolloProvider>, document.getElementById('root'));
