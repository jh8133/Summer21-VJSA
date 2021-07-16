/**
 * Get a formatted date in the future (or past) from a timestamp
 * @return {String} A formatted date string
 */
var dateHelper = function (options) {

    "use strict";

    /*!
    * Deep merge two or more objects into the first.
    * (c) 2021 Chris Ferdinandi, MIT License, https://gomakethings.com
    * @param   {Object} objects  The objects to merge together
    * @returns {Object}          Merged values of defaults and options
    */
    function deepAssign () {

        // Make sure there are objects to merge
        let len = arguments.length;
        if (len < 1) return;
        if (len < 2) return arguments[0];

        // Merge all objects into first
        for (let i = 1; i < len; i++) {
            for (let key in arguments[i]) {
                // If it's an object, recursively merge
                // Otherwise, push to key
                if (Object.prototype.toString.call(arguments[i][key]) === '[object Object]') {
                    arguments[0][key] = deepAssign(arguments[0][key] || {}, arguments[i][key]);
                } else {
                    arguments[0][key] = arguments[i][key];
                }
            }
        }

        return arguments[0];

    }

    // Default settings
    var defaults = {
        fromNow: '',
        locale: 'en-US',
	    format: {
	        dateStyle: 'short',
        	timeStyle: 'long',
	        hour12: true
	    }
    };

    // Deep merge user options and defaults
    var settings = deepAssign(defaults, options);
    console.log(settings);
    

    /**
     * Get a fomratted date in the future (or past) from a timestamp
     * @return {timestamp} A
     */
    function timestampMath (fromNowStr) {
        let offset = 0;

        let regexp = new RegExp(/(\+|-)(\d{1,5})((ms)|s|i|h|d|w|m|y)/mi);
        let fromNowArray = fromNowStr.match(regexp);

        // Timestamp Math
        switch (fromNowArray[3].toLowerCase()) {
            case 'ms': // milliseconds = 1ms 
                offset = 1;
                break;
            case 's': // seconds = 1000ms 
                offset = 1000;
                break;
            case 'i': // 1 minute = 1000ms * 60s 
                offset = 1000 * 60;
                break;
            case 'h': // hours = 1000ms * 60s * 60m
                offset = 1000 * 60 * 60;
                break;
            case 'd': // day = 1000ms * 60s * 60m * 24h
                offset = 1000 * 60 * 60 * 24;
                break;
            case 'w': // weeks = 1000ms * 60s * 60m * 24h * 7d
                offset = 1000 * 60 * 60 * 24 * 7;
                break;
            case 'm': // months = 1000ms * 60s * 60m * 30d (approximately)
                offset = 1000 * 60 * 60 * 24 * 30;
                break;
            case 'y': // 1 year = 1000ms * 60s * 60m * 24h * 365d
                offset = 1000 * 60 * 60 * 24 * 365;
                break;
        }
        if (fromNowArray[1] == '+') {
            return fromNowArray[2] * offset;
        }
        else {
            return -1 * fromNowArray[2] * offset;
        }
    }

    let ts = Date.now();
    let offset = timestampMath(settings.fromNow);

    // Convert a timestamp into a Date object
    let dateObj = new Date(ts + offset);
    // Get a formatted string
    // returns something like "July 6, 2021 at 1:42 PM"
    let dateText = dateObj.toLocaleString(settings.locale, settings.format);
    
    if (dateText) {
        return dateText;
    }
    else {
        throw 'Error formatting the date, check your settings.';
    }
}
