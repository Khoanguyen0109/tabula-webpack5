import isEmpty from 'lodash/isEmpty';
// import cloneDeep from 'lodash/cloneDeep';
// import uniqueId from 'lodash/uniqueId';
export const generateData = (data, columnKey) => {
  const cloneData = !isEmpty(data) ? {...data} : { noItems: [] };
  Object.keys(cloneData).forEach((key) => {
    cloneData[key].forEach((i, index) => {
      // console.log(i);
      const newItem = {};
      newItem.data = i;
      // newItem.id = uniqueId(`${columnKey}_${i.type || 0}_${i.id}_`);
      newItem.id = `${columnKey}_${i.type || 0}${i.type === 3 ? `-${ i.quizType}`: ''}_${i.id}`;
      // newItem.id = uniqueId(`${key}_`);
      cloneData[key][index] = newItem;
    });
  });
  return {
    [`${columnKey}`]: { ...cloneData}
  };
};

export const getColumnKeys =(quoteMap) => {
  if (isEmpty(quoteMap)) {
    return ['noItems'];
  }
  return Object.keys(quoteMap).sort();
};