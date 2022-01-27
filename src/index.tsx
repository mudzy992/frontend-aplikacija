import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.js';
import 'popper.js/dist/popper.js';
import 'bootstrap/dist/js/bootstrap.min.js'
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import { MainManu } from './components/MainMenu/MainMenu'

ReactDOM.render(
  <React.StrictMode>
    <MainManu />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
reportWebVitals();
