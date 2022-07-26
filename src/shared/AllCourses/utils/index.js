import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import map from 'lodash/map';

export const getAssessmentMethodDetails = (list = [], id = -1) => {
  if (list.length > 0) {
    const indexOfId = findIndex(list, (item) => item?.id === id);
    if (indexOfId !== -1) {
      const newList = cloneDeep(list[indexOfId]?.ranges.filter((item) => item?.assessmentMethodId === id));
      /**
       * By default we sort by descending (api sorted). Updated requirement starting with the second row add '<' as prefix
       */
      const processNewList = map(newList, (item, index) => {
        if (index > 0) {
          item.rangeTo = `< ${item.rangeTo}`;
        }
        return item;
      });
      return processNewList;
    }
  }
  return [];
};

export const fieldsSortName = [{ name: 'firstName', label: 'first_name' }, { name: 'lastName', label: 'last_name' }];

export const methodSort = {
  DESC: {
    name: 'desc',
    method: 'sort'
  },
  ASC: {
    name: 'asc',
    method: 'reverse'
  }
};
