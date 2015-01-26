(function($){

  var Prompt = Backbone.Model.extend({

    defaults: {
      "id": '1234',
      "prompt_id": '', // prompt_ids correspond to prompt flow diagram
      "questionText" : '',
    }

  });

  var PromptSet = Backbone.Collection.extend({

    model: Prompt

  });

  var PromptResponse = Backbone.Model.extend({

    defaults: {
      // remove participant id once i collect these into AdherenceResponse
      "participant_id": "test - " + new Date(new Date().getTime()).toString(),
      "prompt_id": '',
      "response": '',
    },

  });

  var AdherenceResponse = Backbone.Model.extend({

    defaults: {
      "participant_id": "test - " + new Date(new Date().getTime()).toString(),
      "reponses": '',
    }

  });

  var ResponseSet = Backbone.Collection.extend({
    model: AdherenceResponse
  });

  var PromptView = Backbone.View.extend({
    el: $('body'),

    events: {
      // none yet
    },

    initialize: function(){
      _.bindAll(this, 'render');
    },

    // render a form for a single prompt
    render: function(){

      $('body').append('<p>' + this.model.get('questionText') + '</p>');
      return this;
    },

  });

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

      this.collection = new PromptSet();
      // this.collection.bind('add', this.appendItem); // collection event binder

      this.render();
    },

    render: function(){

      var prompt = new Prompt();

      // todo: set these in showNextPrompt
      // or figure out where to set these in general
      prompt.set({

        prompt_id: 'q1a',
        questionText: 'Did you take your medication today?',

      });

      this.collection.add(prompt);

      var promptView = new PromptView({
        model: prompt
      });

      $(this.el).append(promptView.render().el);

    },

    showNextPrompt: function(){

      // based on the user response
      // and the current prompt id
      // show them the next prompt or
      // give feedback

    },

    postAdherenceResponse: function(){

      var form = $(document.base);

      var currentPrompt = this.collection.get('1234');
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

          // comment if not working in cordova
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

})(jQuery);
