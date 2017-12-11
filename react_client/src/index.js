// Keep the package light and only import the CSS
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
// React
import React from 'react';
import ReactDOM from 'react-dom';
// Redux
import { Provider } from 'react-redux';
import configureStore from './redux/configureStore';
// React Router
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
// Imports
import './index.css';
import App from './app';
import registerServiceWorker from './registerServiceWorker';

// Initialise browser history / redux
const browserHistory = createBrowserHistory({/* pass a configuration object here if needed */});
const store = configureStore();

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={browserHistory}>
        <App />
      </Router>
    </Provider>
    , document.getElementById('root'),
  );
};


store.subscribe(render);
render();
registerServiceWorker();
