const componentGenerator = require('./component/index');
const moduleGenerator = require('./module/index');

module.exports = (plop) => {
    plop.setGenerator('module', moduleGenerator);
    plop.setGenerator('component', componentGenerator);

  };