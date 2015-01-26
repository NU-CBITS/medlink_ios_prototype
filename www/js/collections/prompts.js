var Prompts = Backbone.Collection.extend({

  model: Prompt

});

var q1a = new Prompt( id: "1", prompt_id: "q1a", questionText: "Did you take your medication today?" );
var q2a = new Prompt( id: "2", prompt_id: "q2a", questionText: "Do you plan to take your medication today?" );

var prompts = new Prompts([q1a, q2a]);

return prompts;
