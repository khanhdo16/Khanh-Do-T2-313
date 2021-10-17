import 'semantic-ui-css/semantic.min.css'
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css'
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import App from './App';
import { AuthProvider } from './use-auth';

ReactDOM.render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>,
  document.getElementById('root')
);

