let dateUtil = (function() {

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

    /**
     * Get a fomratted date in the future (or past) from a timestamp
     * @return {timestamp} A
     */
    function timestampMath (fromNowStr) {
        let regexp = new RegExp(/(\+|-)(\d{1,5})((ms)|s|i|h|d|w|m|y)/mi);
        let offset = 0;

        // Timestamp Math
        let validTimes = {
            ms: 1,
            s: 1000,
            i: 1000 * 60,
            h: 1000 * 60 * 60,
            d: 1000 * 60 * 60 * 24,
            w: 1000 * 60 * 60 * 24 * 7,
            m: 1000 * 60 * 60 * 24 * 30,
            y: 1000 * 60 * 60 * 24 * 365,
        }

        let fromNowArray = fromNowStr.match(regexp);

        if (!fromNowArray || !fromNowArray.len >= 4) {
            throw 'invalid input, Usage: +|-Nms|s|i|h|d|w|m|y, where N is the desired units';
        }
        else {
            offset = validTimes[fromNowArray[3].toLowerCase()];
            if (!offset) {
                throw 'invalid input, Usage: +|-Nms|s|i|h|d|w|m|y, where N is the desired units';
            }
            else {
                if (fromNowArray[1] == '+') {
                    offset = fromNowArray[2] * offset;
                }
                else {
                    offset = -1 * fromNowArray[2] * offset;
                }
            }
        }
        return Date.now() + offset;
    }

    function getDateString(options = {}) {
        // Default settings
        var defaults = {
            date: Date.now(),
            locale: 'en-US',
            format: {
                dateStyle: 'short',
                timeStyle: 'long',
                hour12: true
            }
        };

        // Deep merge user options and defaults
        var settings = deepAssign(defaults, options);
     
        // Convert a timestamp into a Date object
        let dateObj = new Date(settings.date);
        
        // Format the ts as a string
        let dateText = dateObj.toLocaleString(settings.locale, settings.format);
        
        if (dateText) {
            return dateText;
        }
        else {
            throw 'Error formatting the date, check your settings.';
        }
    }

    function fromNowString(units, timeFrame, future) {
        return future == true ? `+${units}${timeFrame}` : `-${units}${timeFrame}`;
    }

    function msFromNow(units, future = true) {
        return timestampMath(fromNowString(units, 'ms', future));
    }
    function secsFromNow(units, future = true) {
        return timestampMath(fromNowString(units, 's', future));
    }
    function minsFromNow(units, future = true) {
        return timestampMath(fromNowString(units, 'm', future));
    }
    function daysFromNow(units, future = true) {
        return timestampMath(fromNowString(units, 'd', future));
    }
    function weeksFromNow(units, future = true) {
        return timestampMath(fromNowString(units, 'w', future));
    }
    function monthsFromNow(units, future = true) {
        return timestampMath(fromNowString(units, 'm', future));
    }
    function yearsFromNow(units, future = true) {
        return timestampMath(fromNowString(units, 'y', future));
    }

    return {getDateString, msFromNow, secsFromNow, minsFromNow, daysFromNow, weeksFromNow, monthsFromNow, yearsFromNow};

}) ();
