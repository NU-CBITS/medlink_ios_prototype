// Filename: main.js

// Require.js allows us to configure shortcut alias
// There usage will become more apparent further along in the tutorial.
require.config({
  paths: {
    jquery: 'vendor/jquery-2.0.3',
    underscore: 'vendor/underscore',
    backbone: 'vendor/backbone'
  },

  shim: {
    backbone: {
      deps: ['jquery','underscore'],
      exports: 'Backbone'
    }
  }

});

require([

  // Load our app module and pass it to our definition function
  'app',
  ], function(App){
    // When I initilize it call this fn
    // App.initialize();
  });
