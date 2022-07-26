import createReducers from 'utils/createReducers';

import { actions } from './constants';

export const initialState = {
    isFetchingFile: true,
    importError: []
};

export default createReducers(initialState, actions, actions.RESET_FILE_PREVIEW);
