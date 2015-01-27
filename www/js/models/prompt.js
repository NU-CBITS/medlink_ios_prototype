var app = app || {};

define([
  'underscore',
  'backbone',
  ], function(_, Backbone){

  // defines a medication adherence question
  // corresponding to one of the items in the clincal prompt flow diagram
  var Prompt = Backbone.Model.extend({

    defaults: {
      "id": 139,
      "prompt_id": '', // prompt_ids correspond to prompt flow diagram
      "questionText" : '',
    }

  });

  return Prompt;

});
