define(["backbone"], function(Backbone) {
  var Prompt = Backbone.Model.extend({

    defaults: {
      "id": '1234',
      "prompt_id": '', // prompt_ids correspond to prompt flow diagram
      "questionText" : '',
    }

  });

  return Prompt;
});
