import React from 'react';
import { useStore } from 'react-redux';

import { useAuthDataContext } from 'AppRoute/AuthProvider';

const withReducer = (key, reducer, appendReducer, epic) => (WrappedComponent) => {

  const Extended = (props) => {
    // console.log(context);
    // let store = context.store;
    // if (!store) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const store = useStore();
    const context = useAuthDataContext();
    // }

    store.injectReducer(key, reducer, appendReducer, epic);
    return <WrappedComponent {...props} context={context} />;

  };
  // Extended.contextTypes = {
  //   store: object
  // };
  return Extended;
};

export default withReducer;