cordova.define("de.appplant.cordova.plugin.local-notification.LocalNotification", function(require, exports, module) { /*
    Copyright 2013-2014 appPlant UG

    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
*/

var exec    = require('cordova/exec'),
    channel = require('cordova/channel');


// Called after 'deviceready' event
channel.deviceready.subscribe( function () {
    // Device is ready now, the listeners are registered
    // and all queued events can be executed.
    exec(null, null, 'LocalNotification', 'deviceready', []);
});

// Called before 'deviceready' event
channel.onCordovaReady.subscribe( function () {
    // The cordova device plugin is ready now
    channel.onCordovaInfoReady.subscribe( function () {
        if (device.platform == 'Android') {
            channel.onPause.subscribe( function () {
                // Necessary to set the state to `background`
                exec(null, null, 'LocalNotification', 'pause', []);
            });

            channel.onResume.subscribe( function () {
                // Necessary to set the state to `foreground`
                exec(null, null, 'LocalNotification', 'resume', []);
            });

            // Necessary to set the state to `foreground`
            exec(null, null, 'LocalNotification', 'resume', []);
        }

        // Merges the platform specific properties into the default properties
        exports.applyPlatformSpecificOptions();
    });
});


/**
 * @private
 *
 * Default values.
 */
exports._defaults = {
    message:    '',
    title:      '',
    autoCancel: false,
    badge:      -1,
    id:         '0',
    json:       '',
    repeat:     ''
};


/**
 * Returns the default settings
 *
 * @return {Object}
 */
exports.getDefaults = function () {
    return this._defaults;
};

/**
 * Overwrite default settings
 *
 * @param {Object} defaults
 */
exports.setDefaults = function (newDefaults) {
    var defaults = this.getDefaults();

    for (var key in defaults) {
        if (newDefaults[key] !== undefined) {
            defaults[key] = newDefaults[key];
        }
    }
};

/**
 * Add a new entry to the registry
 *
 * @param {Object} props
 *      The notification properties
 * @param {Function} callback
 *      A function to be called after the notification has been canceled
 * @param {Object} scope
 *      The scope for the callback function
 */
exports.add = function (props, callback, scope) {
    this.registerPermission(function(granted) {

        if (!granted)
            return;

        var notifications = Array.isArray(props) ? props : [props];

        for (var i = 0; i < notifications.length; i++) {
            var properties = notifications[i];

            this.mergeWithDefaults(properties);
            this.convertProperties(properties);
        }

        if (device.platform != 'iOS') {
            notifications = notifications[0];
        }

        this.exec('add', notifications, callback, scope);
    }, this);
};

/**
 * Update existing notification specified by ID in options.
 *
 * @param {Object} options
 *      The notification properties to update
 * @param {Function} callback
 *      A function to be called after the notification has been updated
 * @param {Object} scope
 *      The scope for the callback function
 */
exports.update = function (options, callback, scope) {
    this.exec('update', options, callback, scope);
};

/**
 * Clears the specified notification.
 *
 * @param {String} id
 *      The ID of the notification
 * @param {Function} callback
 *      A function to be called after the notification has been cleared
 * @param {Object} scope
 *      The scope for the callback function
 */
exports.clear = function (id, callback, scope) {
    var notId = (id || '0').toString();

    this.exec('clear', notId, callback, scope);
};

/**
 * Clears all previously sheduled notifications.
 *
 * @param {Function} callback
 *      A function to be called after all notifications have been cleared
 * @param {Object} scope
 *      The scope for the callback function
 */
exports.clearAll = function (callback, scope) {
    this.exec('clearAll', null, callback, scope);
};

/**
 * Cancels the specified notifications.
 *
 * @param {String[]} ids
 *      The IDs of the notifications
 * @param {Function} callback
 *      A function to be called after the notifications has been canceled
 * @param {Object} scope
 *      The scope for the callback function
 */
exports.cancel = function (ids, callback, scope) {

    ids = Array.isArray(ids) ? ids : [ids];

    for (var i = 0; i < ids.length; i++) {
        ids[i] = ids[i].toString();
    }

    if (device.platform != 'iOS') {
        ids = ids[0];
    }

    this.exec('cancel', ids, callback, scope);
};

/**
 * Removes all previously registered notifications.
 *
 * @param {Function} callback
 *      A function to be called after all notifications have been canceled
 * @param {Object} scope
 *      The scope for the callback function
 */
exports.cancelAll = function (callback, scope) {
    this.exec('cancelAll', null, callback, scope);
};

/**
 * Retrieves a list with all currently pending notifications.
 *
 * @param {Function} callback
 *      A callback function to be called with the list
 * @param {Object} scope
 *      The scope for the callback function
 */
exports.getScheduledIds = function (callback, scope) {
    this.exec('getScheduledIds', null, callback, scope);
};

/**
 * Checks wether a notification with an ID is scheduled.
 *
 * @param {String} id
 *      The ID of the notification
 * @param {Function} callback
 *      A callback function to be called with the list
 * @param {Object} scope
 *      The scope for the callback function
 */
exports.isScheduled = function (id, callback, scope) {
    var notId = (id || '0').toString();

    this.exec('isScheduled', notId, callback, scope);
};

/**
 * Retrieves a list with all triggered notifications.
 *
 * @param {Function} callback
 *      A callback function to be called with the list
 * @param {Object} scope
 *      The scope for the callback function
 */
exports.getTriggeredIds = function (callback, scope) {
    this.exec('getTriggeredIds', null, callback, scope);
};

/**
 * Checks wether a notification with an ID was triggered.
 *
 * @param {String} id
 *      The ID of the notification
 * @param {Function} callback
 *      A callback function to be called with the list
 * @param {Object} scope
 *      The scope for the callback function
 */
exports.isTriggered = function (id, callback, scope) {
    var notId = (id || '0').toString();

    this.exec('isTriggered', notId, callback, scope);
};

/**
 * Informs if the app has the permission to show notifications.
 *
 * @param {Function} callback
 *      The function to be exec as the callback
 * @param {Object?} scope
 *      The callback function's scope
 */
exports.hasPermission = function (callback, scope) {
    var fn = this.createCallbackFn(callback, scope);

    if (device.platform != 'iOS') {
        fn(true);
        return;
    }

    exec(fn, null, 'LocalNotification', 'hasPermission', []);
};

/**
 * Register permission to show notifications if not already granted.
 *
 * @param {Function} callback
 *      The function to be exec as the callback
 * @param {Object?} scope
 *      The callback function's scope
 */
exports.registerPermission = function (callback, scope) {
    var fn = this.createCallbackFn(callback, scope);

    if (device.platform != 'iOS') {
        fn(true);
        return;
    }

    exec(fn, null, 'LocalNotification', 'registerPermission', []);
};

/**
 * @deprecated
 *
 * Register permission to show notifications if not already granted.
 *
 * @param {Function} callback
 *      The function to be exec as the callback
 * @param {Object?} scope
 *      The callback function's scope
 */
exports.promptForPermission = function (callback, scope) {
    console.warn('Depreated: Please use `notification.local.registerPermission` instead.');

    exports.registerPermission.apply(this, arguments);
};

/**
 * Add new entries to the registry (more than one)
 *
 * @param {Object} options
 *      The notification properties
 * @param {Function} callback
 *      A function to be called after the notification has been added
 * @param {Object} scope
 *      The scope for the callback function
 *
 * @return {Number}
 *      The notification's ID
 */
exports.addMultiple = function (notifications, callback, scope) {
    var length = notifications.length;
    var notificationsMerged = new Array(),
        callbackFn = this.createCallbackFn(callback, scope);
    for (var i=0;i<length;i++){
        var options    = this.mergeWithDefaults(notifications[i]);
        if (options.id) {
            options.id = options.id.toString();
        }

        if (options.date === undefined) {
            options.date = new Date();
        }

        if (options.title) {
            options.title = options.title.toString();
        }

        if (options.message) {
            options.message = options.message.toString();
        }

        if (typeof options.date == 'object') {
            options.date = Math.round(options.date.getTime()/1000);
        }

        if (['WinCE', 'Win32NT'].indexOf(device.platform) > -1) {
            callbackFn = function (cmd) {
                eval(cmd);
            };
        }
        notificationsMerged.push(options);
    }

    cordova.exec(callbackFn, null, 'LocalNotification', 'addMultiple', notificationsMerged);

    return options.id;
};

/**
 * Clear the specified notifications (more than one).
 *
 * @param {String} id
 *      The ID of the notification
 * @param {Function} callback
 *      A function to be called after the notifications has been cleared.
 * @param {Object} scope
 *      The scope for the callback function
 */
exports.clearMultiple = function (ids, callback, scope) {
    var length = ids.length;
    var idArray = new Array(),
        callbackFn = this.createCallbackFn(callback, scope);
    for (var i=0;i<length;i++){
        var id         = ids[i].toString();
        idArray.push(id);
    }
    var callbackFn = this.createCallbackFn(callback, scope);
    cordova.exec(callbackFn, null, 'LocalNotification', 'clearMultiple', [ids]);
};

/**
 * Cancel the specified notifications (more than one).
 *
 * @param {String} id
 *      The ID of the notification
 * @param {Function} callback
 *      A function to be called after the notifications has been canceled
 * @param {Object} scope
 *      The scope for the callback function
 */
exports.cancelMultiple = function (ids, callback, scope) {
    var length = ids.length;
    var idArray = new Array(),
        callbackFn = this.createCallbackFn(callback, scope);
    for (var i=0;i<length;i++){
        var id         = ids[i].toString();
        idArray.push(id);
    }
    var callbackFn = this.createCallbackFn(callback, scope);
    cordova.exec(callbackFn, null, 'LocalNotification', 'cancelMultiple', [ids]);
};

/**
 * Occurs when a notification was added.
 *
 * @param {String} id
 *      The ID of the notification
 * @param {String} state
 *      Either "foreground" or "background"
 * @param {String} json
 *      A custom (JSON) string
 * @param {Object} data
 *      The notification properties
 */
exports.onadd = function (id, state, json, data) {};

/**
 * Occurs when the notification is triggered.
 *
 * @param {String} id
 *      The ID of the notification
 * @param {String} state
 *      Either "foreground" or "background"
 * @param {String} json
 *      A custom (JSON) string
 * @param {Object} data
 *      The notification properties
 */
exports.ontrigger = function (id, state, json, data) {};

/**
 * Fires after the notification was clicked.
 *
 * @param {String} id
 *      The ID of the notification
 * @param {String} state
 *      Either "foreground" or "background"
 * @param {String} json
 *      A custom (JSON) string
 * @param {Object} data
 *      The notification properties
 */
exports.onclick = function (id, state, json, data) {};

/**
 * Fires if the notification was canceled.
 *
 * @param {String} id
 *      The ID of the notification
 * @param {String} state
 *      Either "foreground" or "background"
 * @param {String} json
 *      A custom (JSON) string
 * @param {Object} data
 *      The notification properties
 */
exports.oncancel = function (id, state, json, data) {};

/**
 * Get fired when the notification was cleared.
 *
 * @param {String} id
 *      The ID of the notification
 * @param {String} state
 *      Either "foreground" or "background"
 * @param {String} json
 *      A custom (JSON) string
 * @param {Object} data
 *      The notification properties
 */
exports.onclear = function (id, state, json, data) {};


/**
 * @private
 *
 * Merges custom properties with the default values.
 *
 * @param {Object} options
 *      Set of custom values
 *
 * @retrun {Object}
 *      The merged property list
 */
exports.mergeWithDefaults = function (options) {
    var defaults = this.getDefaults();

    for (var key in defaults) {
        if (options[key] === undefined) {
            options[key] = defaults[key];
        }
    }

    return options;
};

/**
 * @private
 *
 * Convert the passed values to their required type.
 *
 * @param {Object} options
 *      Set of custom values
 *
 * @retrun {Object}
 *      The converted property list
 */
exports.convertProperties = function (options) {
    if (options.id) {
        options.id = options.id.toString();
    }

    if (options.date === undefined) {
        options.date = new Date();
    }

    if (options.title) {
        options.title = options.title.toString();
    }

    if (options.message) {
        options.message = options.message.toString();
    }

    if (options.text) {
        options.message = options.text.toString();
    }

    if (typeof options.date == 'object') {
        options.date = Math.round(options.date.getTime()/1000);
    }

    if (typeof options.json == 'object') {
        options.json = JSON.stringify(options.json);
    }

    return options;
};

/**
 * @private
 *
 * Merges the platform specific properties into the default properties.
 *
 * @return {Object}
 *      The default properties for the platform
 */
exports.applyPlatformSpecificOptions = function () {
    var defaults = this._defaults;

    switch (device.platform) {
    case 'Android':
        defaults.icon       = 'icon';
        defaults.smallIcon  = null;
        defaults.ongoing    = false;
        defaults.led        = 'FFFFFF'; /*RRGGBB*/
        defaults.sound      = 'TYPE_NOTIFICATION'; break;
    case 'iOS':
        defaults.sound      = ''; break;
    case 'WinCE': case 'Win32NT':
        defaults.smallImage = null;
        defaults.image      = null;
        defaults.wideImage  = null;
    }

    return defaults;
};

/**
 * @private
 *
 * Creates a callback, which will be executed within a specific scope.
 *
 * @param {Function} callbackFn
 *      The callback function
 * @param {Object} scope
 *      The scope for the function
 *
 * @return {Function}
 *      The new callback function
 */
exports.createCallbackFn = function (callbackFn, scope) {
    if (typeof callbackFn != 'function')
        return;

    return function () {
        callbackFn.apply(scope || this, arguments);
    };
};

/**
 * @private
 *
 * Executes the native counterpart.
 *
 * @param {String} action
 *      The name of the action
 * @param args[]
 *      Array of arguments
 * @param {Function} callback
 *      The callback function
 * @param {Object} scope
 *      The scope for the function
 */
exports.exec = function (action, args, callback, scope) {
    var fn = this.createCallbackFn(callback, scope),
        params = [];

    if (Array.isArray(args)) {
        params = args;
    } else if (args) {
        params.push(args);
    }

    exec(fn, null, 'LocalNotification', action, params);
};

});
