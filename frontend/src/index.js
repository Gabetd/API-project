// frontend/src/index.js
import React from 'react';

import './index.css';

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

import configureStore from './store';



// frontend/src/index.js
// ...
const store = configureStore();

if (process.env.NODE_ENV !== 'production') {
  window.store = store;
}



// frontend/src/index.js
// ...
function Root() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
}


// frontend/src/index.js
// ...
ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root'),
);
