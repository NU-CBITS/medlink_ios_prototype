define([
  'underscore',
  'backbone',
  ], function(_, Backbone){
    
  var AdherenceResponse = Backbone.Model.extend({

    defaults: {
      "participant_id": "test - " + new Date(new Date().getTime()).toString(),
      "reponses": '',
    }

  });

  return AdherenceResponse;

});
