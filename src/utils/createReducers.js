import { handleActions } from 'redux-actions';

const reducer = (initStates, constants, resetConstant = '') => {
  const keys = Object.keys(constants);
  const reducers = {};
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] === resetConstant) {
      reducers[keys[i]] = () => ({
        ...initStates
      });
    } else {
      reducers[keys[i]] = (state, action) => {
        let payload = action.payload;
        if (typeof payload === 'function') {
          payload = payload(state);
        }
        return {
          ...state,
          ...payload
        };
      };
    }
  }

  return handleActions(reducers, initStates);
};

export default reducer;
