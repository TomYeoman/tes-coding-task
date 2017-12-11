import throttle from 'lodash/throttle';
// Redux
import { createStore, applyMiddleware } from 'redux';
// Logs all actions in console if not running live
import { createLogger } from 'redux-logger';
// Allows actions to return functions, instead of plain "action" objects
import thunk from 'redux-thunk';
// Allow us to use DevTools time travel debugger
import { composeWithDevTools } from 'redux-devtools-extension';
// State saving helpers
import { loadState, saveState } from './localStorage';

import tennisGameReducers from './modules/tennisGame';

const configureStore = () => {
  // Uncomment me for persisted state
  // const persistedState = loadState();

  // Set up thunk and middleward to handle ASYNC calls
  const middleware = [thunk];

  if (process.env.NODE_ENV !== 'production') {
    middleware.push(createLogger());
  }

  const store = createStore(
    tennisGameReducers,
    // persistedState,
    composeWithDevTools(applyMiddleware(...middleware),
      // other store enhancers if any
    ),
  );

  store.subscribe(throttle(() => {
    saveState(store.getState());
  }, 1000));

  return store;
};

export default configureStore;
