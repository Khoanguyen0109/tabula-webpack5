import isFunction from 'lodash/isFunction';

import epics from 'epics';
import createReducer from 'reducers';
import { applyMiddleware, compose, createStore } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { BehaviorSubject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const epicMiddleware = createEpicMiddleware();

const epic$ = new BehaviorSubject(epics);
const rootEpic = (action$, state$) => epic$.pipe(
  mergeMap((epic) => epic(action$, state$))
);
const setupStore = () => {
  const store = createStore(
    createReducer(),
    composeEnhancers(applyMiddleware(epicMiddleware))
  );

  store.asyncReducers = {};
  store.injectReducer = (key, reducer, appendReducer, injectEpics) => {
    const checkAppendReducer = isFunction(appendReducer) && !!appendReducer(store.getState()?.[key] || {});
    if (!store.asyncReducers[key] || checkAppendReducer) {
      store.asyncReducers[key] = reducer;
      store.replaceReducer(createReducer(store.asyncReducers));
      injectEpics && epic$.next(combineEpics(...injectEpics));
      // if (injectEpics) {
      //   // epic$.next(...injectEpics);
      //   injectEpics.forEach(e => {
      //     epic$.next(e);  
      //   });

      // }
    }
    return store;
  };
  epicMiddleware.run(rootEpic);
  return store;
};

export default setupStore;