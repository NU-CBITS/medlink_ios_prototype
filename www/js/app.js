requirejs.config({
  shim: {
    "backbone": {
      deps: ["lodash", "jquery"],
      exports: "Backbone"
    },
    "bootstrap": {
      deps: ["jquery"],
      exports: "Bootstrap"
    }
  },
  paths: {
    bootstrap: "vendor/bootstrap-3.0.0.min",
    backbone: "vendor/backbone-1.1.0.min",
    jquery: "vendor/jquery-2.0.3.min",
    lodash: "vendor/lodash-1.3.1.min",
    text: "vendor/text-2.0.10",
    localstorage: "vendor/backbone.localStorage-1.1.6.min",
    fastclick: "vendor/fastclick-0.6.9.min",
    moment: "vendor/moment-2.4.0.min",
  }
});

(function() {
  var appView = null;

  define([
    "backbone",
    "bootstrap",
    "router",
    "views/app-view",
    "models/settings",
    "collections/adherence-values"
  ], function(Backbone, Bootstrap, router, AppView, settings, adherenceValues) {
    if (window.MedLink && window.MedLink.Settings) {
      settings.setConfigUrlBase(window.MedLink.Settings.participantConfigurationUrl);
    }

    document.addEventListener("deviceready", onDeviceReady, false);
    document.addEventListener("resume", onDeviceReady, false);
    document.addEventListener("backbutton", function() {
      if ($('#assessment-view').length === 1) {
        return false;
      } else {
        navigator.app.backHistory();
      }
    });

    if (typeof cordova === "undefined") {
      onDeviceReady();
    }

    function onDeviceReady() {
      if (appView === null) {
        $('#main').html('<h2>Fetching participant ID...</h2>');
      }

      settings.fetchParticipantId({
        done: function() {
          adherenceValues.handleResponse()
            .done(function(adherenceCode) {
              console.log('MedLink adherence code: ' + adherenceCode[0].payload);
              if (adherenceCode[0].payload === "responseTrue") {
                var messages = [
                  { title: "Excellent!", body: "You are on track." },
                  { title: "Great!", body: "Thanks for letting us know." }
                ];
                var message = messages[_.random(0, messages.length - 1)];
                navigator.notification.alert(message.body, (function() {}), message.title);
              } else if (adherenceCode[0].payload === "responseFalse") {
                navigator.notification.alert("Thanks for letting us know.", (function() {}), "Ok");
              }

              if (appView === null) {
                $('#main').html('');
                appView = new AppView({ router: router });
              }

              try {
                Backbone.history.start({ root: window.location.pathname });
              }
              catch (e) {
                console.log("history already started");
                //Backbone.history.location.reload();
              }
              settings.setFontSize();
            })
            .fail(function() {
              setTimeout(onDeviceReady, 5000);
              $('#main').html('<h2>There was an issue, retrying in 5 seconds.</h2>');
            });
        },
        fail: function() {
          $('#main').html('<h2>Please configure your user id.</h2>');
        }
      });
    }
  });
})();
