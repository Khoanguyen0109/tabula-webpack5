import createReducers from 'utils/createReducers';

import { actions } from './constants';

const initialState = {
    // assignmentList: [],
    sectionList: [],
    filtersSelected: [],
    gradingList: [],
    attemptList: [ ],
    total: 0,
    graded: 0,
    graderDetail: {},
    basicInfo: {},
    isOverTime: true
};

export default createReducers(initialState, actions , actions.GRADER_RESET_STATE);