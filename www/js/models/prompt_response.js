define(["backbone"], function(Backbone) {
  var PromptResponse = Backbone.Model.extend({

    defaults: {
      // remove participant id once i collect these into AdherenceResponse
      "participant_id": "test - " + new Date(new Date().getTime()).toString(),
      "prompt_id": '',
      "response": '',
    },

  });

  return PromptResponse;
});
