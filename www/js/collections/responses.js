define([
  'underscore',
  'backbone',
  'models/adherence_response'
  ], function(_, Backbone, AdherenceResponse){

    var Responses = Backbone.Collection.extend({

      model: AdherenceResponse

    });

    return Responses;
});
