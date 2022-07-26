import schemaMethod from 'utils/yupValidation';

import myTasksSchemaMethod from 'shared/MyTasks/yupValidation';

import * as Yup from 'yup';

[schemaMethod, myTasksSchemaMethod].forEach((schema) => {
  const { schemaType, methods } = schema;
  Object.keys(methods).forEach(((name) => {
    Yup.addMethod(Yup[schemaType], name, methods[name]);
  }));
});