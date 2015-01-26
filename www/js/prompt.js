(function($){

  var PromptResponse = Backbone.Model.extend({

    defaults: {
      "participant_id": "test - " + new Date(new Date().getTime()).toString(),
      "prompt": "q1a",
      "response": '',
    },

  });

  var AdherenceResponse = Backbone.Collection.extend({

    // all prompt responses are grouped into one Adherence Response
    model: PromptResponse

  });


  var PromptView = Backbone.View.extend({
    el: $('body'),

    events: {
      'submit' : 'postAdherenceResponse',
    },

    initialize: function(){
      _.bindAll(this, 'render', 'addPromptResponse','postAdherenceResponse');

      this.collection = new AdherenceResponse();
      this.collection.bind('submit', this.addPromptResponse);

      this.render();
    },

    render: function(){

      // eventually we'll build forms from a collection of prompts

      $(this.el).append("<p>prompt text</p>");
      $(this.el).append("<form name='q1a'><input type='radio' name='adherence' value='yes'> Yep </br><input type='radio' name='adherence' value='no'> Absolutely not </br><input id='q1aSubmit' type='submit' value='submit'></form>");
    },

    addPromptResponse: function(){

    },

    postAdherenceResponse: function(){

      var form = $(this.q1a);
      var answer = JSON.stringify(form.serializeArray());

      // semi-static test payload
      var promptResponse = new PromptResponse();
      promptResponse.response = answer;

      // todo: put the prompt response into collection, send that instead
      var adherenceResponse = JSON.stringify(promptResponse);

      var report = $.ajax({
        url: 'http://localhost:3000/reports.json',
        type: 'POST',
        contentType:'application/json',
        data: adherenceResponse,

        // currently success callback not firing
        // seems to be part of cors suite of annoyances
        success: function(){

          alert("data sent. thanks for letting us know!");

        },

        // add payload to local storage to post later
        error: function(){

          payloadDateTag = 'payload' + new Date(new Date().getTime()).toString();

          // in backbone implementation store these under 'adherence' namespace

          window.localStorage.setItem(payloadDateTag, adherenceResponse);
          alert("we stored your data to send later.");

        },

        });
    },

  });

  var promptView = new PromptView();

})(jQuery);
