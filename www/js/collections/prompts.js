define([
  'underscore',
  'backbone',
  'models/prompt'
  ], function(_, Backbone, Prompt){

    var Prompts = Backbone.Collection.extend({

      model: Prompt

    });

    return Prompts;
});
