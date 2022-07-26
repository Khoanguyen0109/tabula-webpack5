module.exports = {
    description: 'Create a new component',
    // User input prompts provided as arguments to the template
    prompts: [
      {
        // Raw text input
        type: 'input',
        // Variable name for this input
        name: 'name',
        // Prompt to display on command line
        message: 'What is your component name?'
      },
    ],
    actions: [
      {
        // Add a new file
        type: 'add',
        // Path for the new file
        path: '../src/components/{{pascalCase name}}/index.js',
        // Handlebars template used to generate content of new file
        templateFile: 'component/index.js.hbs',
      },
      {
          // Add a new file
          type: 'add',
          // Path for the new file
          path: '../src/components/{{pascalCase name}}/styles.js',
          // Handlebars template used to generate content of new file
          templateFile: 'component/styles.js.hbs',
        },
        {
          // Add a new file
          type: 'add',
          // Path for the new file
          path: '../src/components/{{pascalCase name}}/sample.js',
          // Handlebars template used to generate content of new file
          templateFile: 'module/sample.js.hbs',
        },
        // {
        //   // Add a new file
        //   type: 'append',
        //   pattern: '/(//appendHere\s)/g', // keep this line - the template will append bellow your comment
        //   path: '../src/modules/{{pascalCase name}}/constants.js',
        //   // Handlebars template used to generate content of new file
        //   templateFile: 'module/constants.js.hbs',
        // },
    ],
  };