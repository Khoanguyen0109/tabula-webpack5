module.exports = {
    description: 'Create a new module',
    // User input prompts provided as arguments to the template
    prompts: [
      {
        // Raw text input
        type: 'input',
        // Variable name for this input
        name: 'name',
        // Prompt to display on command line
        message: 'What is your module name?'
      },
    ],
    actions: [
      {
        // Add a new file
        type: 'add',
        // Path for the new file
        path: '../src/modules/{{pascalCase name}}/containers/index.js',
        // Handlebars template used to generate content of new file
        templateFile: 'module/containers/index.js.hbs',
      },
      {
          // Add a new file
          type: 'add',
          // Path for the new file
          path: '../src/modules/{{pascalCase name}}/components/index.js',
          // Handlebars template used to generate content of new file
          templateFile: 'module/containers/index.js.hbs',
        },
        {
          // Add a new file
          type: 'add',
          // Path for the new file
          path: '../src/modules/{{pascalCase name}}/actions.js',
          // Handlebars template used to generate content of new file
          templateFile: 'module/actions.js.hbs',
        },
        {
          // Add a new file
          type: 'add',
          // Path for the new file
          path: '../src/modules/{{pascalCase name}}/reducers.js',
          // Handlebars template used to generate content of new file
          templateFile: 'module/reducers.js.hbs',
        },
        {
          // Add a new file
          type: 'add',
          // Path for the new file
          path: '../src/modules/{{pascalCase name}}/epics.js',
          // Handlebars template used to generate content of new file
          templateFile: 'module/epics.js.hbs',
        },
        {
          // Add a new file
          type: 'add',
          // Path for the new file
          path: '../src/modules/{{pascalCase name}}/constants.js',
          // Handlebars template used to generate content of new file
          templateFile: 'module/constants.js.hbs',
        },
    ],
  };