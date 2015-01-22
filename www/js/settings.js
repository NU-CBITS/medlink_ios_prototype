define([
  "backbone",
  "lib/purple-robot-client",
  "lib/med-prompt-trigger",
  "version",
  "moment",
  "PurpleRobot"
], function(Backbone, prClient, MedPromptTrigger, version) {
  function Settings() {
    var DEFAULT_FONT_SIZE = 18;
    var CONFIG_URL_BASE = MedLink.SERVER_URL + '/participants/';
    var KEYS = {
      CONFIG_URL_BASE: "MedLink:Config:configUrlBase",
      FONT_SIZE: "MedLink:Config:fontSize",
      MEDICATION_NAME: "MedLink:Config:medicationName",
      MEDICATION_TIME: "MedLink:Config:medicationTime",
      RESEARCH_ASSISTANT: "MedLink:Config:researchAssistant",
      PHYSICIAN: "MedLink:Config:physician",
      START_DATE: "MedLink:Config:startDate",
      PARTICIPANT_ID: "MedLink:Config:participantId",
      WISEPILL_ID: "MedLink:Config:wisepillId",
      LAST_SYNC_AT: "MedLink:Config:lastSyncAt",
      IS_TEST_ACCOUNT: "MedLink:Config:isTestAccount"
    };
    var SYNC_WINDOW_IN_MINUTES = 10;
    var TRIAL_NAME = "MedLink";
    var APP_STRING = "edu.northwestern.cbits.medlink";
    var TRIAL_LENGTH_IN_WEEKS = 12;

    var PROMPT_INTERACTION_CONSTANTS = {
      confirmTitle: "YES",
      cancelTitle: "NO",
      reminderInMinutes: 10
    };

    this.setConfigUrlBase = function(value) {
      localStorage[KEYS.CONFIG_URL_BASE] = value;
    };

    this.getConfigUrlBase = function() {
      return localStorage[KEYS.CONFIG_URL_BASE] || CONFIG_URL_BASE;
    };

    this.setAllSettings = function(value) {
      console.log('MedLink setting all config: ' + JSON.stringify(value));
      if (value === 'cleared') {
        localStorage.clear();
      } else {
        this.setMedicationName(value.medication.name);
        this.setResearchAssistant(value.researchAssistant);
        this.setPhysician(value.physician);
        this.setStartDate(value.startDate);
        this.setIsTestAccount(value.isTestAccount);
        this.setMedicationTime(value.medication.time);
        // this must come last because the trigger depends on the medication time
        this.setWisepillId(value.wisepillId);
      }
    };

    // identity config

    this.getWisepillId = function() {
      console.log("MedLink returning wisepillId as " + localStorage[KEYS.WISEPILL_ID]);
      return localStorage[KEYS.WISEPILL_ID];
    };

    this.setParticipantId = function(participantId) {
      localStorage[KEYS.PARTICIPANT_ID] = participantId;
    };

    this.getParticipantId = function() {
      return localStorage[KEYS.PARTICIPANT_ID];
    };

    this.setWisepillId = function(wisepillId) {
      console.log("MedLink setting wisepillId to " + wisepillId);
      localStorage[KEYS.WISEPILL_ID] = wisepillId;

      var wpUrl = MedLink.SERVER_URL + "/wisepill?id_code=" + wisepillId;
      var hourOfDose = parseInt(this.getMedicationTime().split(":")[0], 10);

      //  var checkForWisepill: function(){}
      // ajax GET request to server

    };

    this.fetchParticipantId = function(callbacks) {
      if (this.getParticipantId()) {
        callbacks.done();
      } else {
        var self = this;

      // GET request via ajax
      }
    };

    this.checkForConfigUpdates = function() {
      var self = this,
          configurationUrl = this.getConfigUrlBase() + this.getParticipantId() + '/configuration';

      return $.getJSON(configurationUrl)
        .done(function(attributes) {
          console.log('applying configuration');
          self.setAllSettings(attributes);
          console.log('posting configuration event');
          self.postConfigurationEvent();
          self.setLastSyncAt();
        });
    };

    this.postConfigurationEvent = function() {
      var hardwareDevice = window.device || {};
      var deviceData = {
        device: {
          model: hardwareDevice.model,
          uuid: hardwareDevice.uuid,
          osVersion: hardwareDevice.version,
          medlinkVersion: version
        }
      };
      var url = this.getConfigUrlBase() + this.getParticipantId() + '/configuration_events';

        $.ajax({
          dataType: 'json',
          url: url,
          data: deviceData,
          type: 'POST'
        });
    };

    this.hasStarted = function() {
      return this.getStartDate() && moment(this.getStartDate()).isBefore(moment().add(1, 'day'), 'day');
    };


    // HALT
    // !
    // everything below this line probably does not need refactoring

    this.getCurrentAssessmentDate = function() {
      var date = moment(this.getStartDate()),
      today = moment();
      while (date.isBefore(moment(today).subtract(6, 'days'), 'day')) {
        date.add('weeks', 1);
      }

      return date;
    };

    this.getNextAssessmentDate = function() {
      var date = moment(this.getStartDate()),
      today = moment();
      while (date.isBefore(today, 'day')) {
        date = date.add('weeks', 1);
      }

      return date;
    };

    this.getDayNumber = function() {
      var startDate = moment(this.getStartDate());
      var now = moment();

      return now.diff(startDate, 'days') + 1;
    };

    this.getWeekNumber = function() {
      var startDate = moment(this.getStartDate());
      var now = moment();

      return now.diff(startDate, 'weeks');
    };

    this.setFontSize = function(size) {
      var newSize = size || this.getFontSize();
      localStorage[KEYS.FONT_SIZE] = newSize;
      this.trigger("changedFontSize", newSize);
    };

    this.getFontSize = function() {
      return localStorage[KEYS.FONT_SIZE] || DEFAULT_FONT_SIZE;
    };

    this.setMedicationName = function(name) {
      localStorage[KEYS.MEDICATION_NAME] = name;
    };

    this.getMedicationName = function() {
      return localStorage[KEYS.MEDICATION_NAME];
    };

    this.setMedicationTime = function(time) {
      // Ignore anything but a legitimate change to the medication dose time.
      if (time === null || typeof time === 'undefined' || time === this.getMedicationTime()) {
        return;
      }

      localStorage[KEYS.MEDICATION_TIME] = time;
      this._updateMedPromptTriggers();
    };

    this.getMedicationTime = function() {
      return localStorage[KEYS.MEDICATION_TIME];
    };

    this.setResearchAssistant = function(ra) {
      localStorage[KEYS.RESEARCH_ASSISTANT] = JSON.stringify(ra);
    };

    this.getResearchAssistant = function() {
      return JSON.parse(localStorage[KEYS.RESEARCH_ASSISTANT] || '{}');
    };

    this.setPhysician = function(phys) {
      localStorage[KEYS.PHYSICIAN] = JSON.stringify(phys);
    };

    this.getPhysician = function() {
      return JSON.parse(localStorage[KEYS.PHYSICIAN] || '{}');
    };

    this.setStartDate = function(date) {
      localStorage[KEYS.START_DATE] = date;
    };

    this.getStartDate = function() {
      return localStorage[KEYS.START_DATE];
    };

    this.isStudyOver = function() {
      var endDate = moment(this.getStartDate())
      .add('weeks', TRIAL_LENGTH_IN_WEEKS)
      .subtract('day', 1);

      return moment().isAfter(endDate);
    };

    this.setLastSyncAt = function() {
      localStorage[KEYS.LAST_SYNC_AT] = moment().toISOString();
    };

    this.getLastSyncAt = function() {
      var lastSyncAt = localStorage[KEYS.LAST_SYNC_AT];

      return (typeof lastSyncAt === 'undefined') ? lastSyncAt : moment(lastSyncAt);
    };

    this.setIsTestAccount = function(isTestAccount) {
      localStorage[KEYS.IS_TEST_ACCOUNT] = isTestAccount;
    };

    this.getIsTestAccount = function() {
      return localStorage[KEYS.IS_TEST_ACCOUNT] === "true";
    };

    this.hasSynced = function() {
      return typeof this.getLastSyncAt() !== 'undefined';
    };

    this.isSynced = function() {
      return this.hasSynced() &&
      moment() < this.getLastSyncAt().add('minutes', SYNC_WINDOW_IN_MINUTES);
    };


  }

  var settings = new Settings();
  _.extend(settings, Backbone.Events);

  if (typeof window.MedLink === 'undefined') {
    window.MedLink = {};
  }
  window.MedLink.setStartDate = settings.setStartDate;

  return settings;
});
