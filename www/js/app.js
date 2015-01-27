define([
  'jquery',
  'underscore',
  'backbone',
  'models/prompt',
  'models/prompt_response',
  ], function($, _, Backbone, Prompt, PromptResponse){

    var myapp = {};

    myapp.questions = new Backbone.Collection();

    myapp.questions.add([
      { id: 1, prompt_id: "q1a", questionText: "Did you take your medication today?"},
      { id: 2, prompt_id: "q2a", questionText: "Do you plan to take your medication today?"},
      { id: 3, prompt_id: "q2b", questionText: "Will you ever take your medication agian?"},
      ]);


  var initialize = function(){

    // call all of the init fn here

  };

  var AdherenceView = Backbone.View.extend({
    el: $('body'),

    events: {
      'submit' : function(e) {
        this.postAdherenceResponse(e);
        this.showNextPrompt(e);
      }

    },

    initialize: function(){
      _.bindAll(this, 'render', 'postAdherenceResponse', 'showNextPrompt', 'fireReminderNote');

      // this.collection.bind('add', this.appendItem); // collection event binder
      this.render();

    },

    render: function(){

      var currentPrompt = myapp.questions.get(1);

      $(this.el).append('<p>' + currentPrompt.get('questionText') + '</p>');

    },

    showNextPrompt: function(){

      // based on the user response
      // and the current prompt id
      // show them the next appropriate prompt or
      // give feedback

    },

    postAdherenceResponse: function(){

      var form = $(document.base);

      // placeholder until i do the multiple prompt stuff
      var currentPrompt = questions.get(1);

      var prompt_id = currentPrompt.get('prompt_id');
      var answer = $( "input:radio:checked" ).val();

      // todo build aherence response hash based on successive prompts
      var promptResponse = new PromptResponse();

      promptResponse.set({

        prompt_id: prompt_id,
        response: answer,

      });

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

          payloadDateTag = 'adherence: ' + new Date(new Date().getTime()).toString();

          window.localStorage.setItem(payloadDateTag, adherenceResponse);
          alert("we stored your data to send later.");

        },

      });


      if (answer.toString() === "no") {

        alert('local note fired');

        // comment out if not working in cordova
        /*
        window.plugin.notification.local.add({
        id: 2,
        date: new Date(new Date().getTime() + 60*1000),
        badge: 1,
        message: 'Tell us more about your medications.',
        title: 'Based on response of no',
        repeat: '',
      });
      */

      // want to do this instead:
      // this.fireReminderNote();

    }

  },

  // schedule a reminder notification 1 minutes in the future
  fireReminderNote: function(){

    window.plugin.notification.local.add({
      id: 2,
      date: new Date(new Date().getTime() + 60*1000),
      badge: 1,
      message: 'Tell us more about your medications.',
      title: 'Based on response of no',
      repeat: '',
    });
  },

  addPromptResponse: function(){

    // for multiple stage responses, concatenate into one payload

  },

});

var adherenceView = new AdherenceView();

});
