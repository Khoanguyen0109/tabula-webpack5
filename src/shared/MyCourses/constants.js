export const QUIZ_TYPE = {
  ANNOUNCED: 1,
  POP: 2,
};

export const QUIZ_GRADE_NAME = {
  0: 'not_started',
  1: 'not_graded',
  2: 'graded',
};

export const GRADE_TYPE_NAME = {
  0: 'non_graded',
  1: 'graded',
};
export const CREDIT_VALUE = [
  {
    value: true,
    label: 'Yes',
  },
  {
    value: false,
    label: 'No',
  },
];

export const TYPE_OF_CREATE = {
  CREATE_AS_DRAFT: 0,
  CREATE_AND_PUBLISH: 1,
};

export const SUBMISSION_METHOD = {
  ONLINE: 1,
  OFFLINE: 2,
  QUIZ: 'QUIZ', // add for gradebook
};

export function infoByType(type) {
  switch (type) {
    case 0:
      return null;
    case 1:
      return {
        typeName: 'Finish',
        typeLabel: 'Complete assignment',
        typeIcon: 'icon-icn_assignment',
      };
    // case 2:
    //   return ({
    //     typeName: 'Assignment',
    //     typeIcon: 'icon-icn_assignment'
    //   });
    case 3:
      return {
        typeName: 'Study',
        typeLabel: 'Study for',
        typeIcon: 'icon-icn_test1',
      };
    case 2:
    default:
      return {
        typeName: 'N/A',
        typeLabel: 'N/A',
        typeIcon: 'no-icon',
      };
  }
}

export const UPDATE_COURSE_SUBCODE = {
  CAN_NOT_UPDATE_TERM: 2,
  CAN_NOT_ADD_SECTION_WHEN_PLANNED: 4,
  DELETE_GRADE_WEIGHT_CATEGORY_FAILED: 101,
};
export const COURSE_STATUS = {
  DRAFT: -1,
  WAITING_FOR_TEACHER: 0,
  PUBLISHED: 1,
  ARCHIVED: 2,
};
