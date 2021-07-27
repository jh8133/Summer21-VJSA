let DateUtil = (function() {

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
     * Get a timestamp in the future (or past) from a timestamp or now
     * @param {string} fromNowStr   a string representing the desired past/future time
     * @param {timestamp} ts        the starting timestamp to add/subtract
     * @return {timestamp}
    */
    function timestampMath (fromNowStr, ts) {
        let stamp = ts ? ts : Date.now();
        let regexp = new RegExp(/(\+|-)(\d{1,5})((ms)|s|i|h|d|w|m|y)/mi);
        let offset = 0;

        // Timestamp Math
        let isLeap = function (ts) {
            let year = new Date(ts).getFullYear();
            return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
        }

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
        return stamp + offset;
    }

    function fromNowString(units, timeFrame) {
        return units >= 0 ? `+${units}${timeFrame}` : `-${units}${timeFrame}`;
    }

    /**
     * The Constructor object
     * @param {date} Integer|String|Date The date or timestamp to use for the methods
    */
    function Constructor (date) {

        // Set properties
        Object.defineProperties(this, {
            timestamp: {value: date ? new Date(date).getTime() : new Date().getTime()}
        });
    }

    /**
     * Get a formatted date string from a given timestamp
     * @param {Object} options  an Object including locale, and format
     * @return {string}
     */
     Constructor.prototype.getDateString = function (options = {}) {
        // Default settings
        var defaults = {
            locale: navigator.language,
            format: {}
        };

        // Deep merge user options and defaults
        var settings = deepAssign(defaults, options);
     
        // Convert a timestamp into a Date object
        let dateObj = new Date(this.timestamp);
        
        // Format the ts as a string
        let dateText = dateObj.toLocaleString(settings.locale, settings.format);
        
        if (dateText) {
            return dateText;
        }
        else {
            throw 'Error formatting the date, check your settings.';
        }
    }

    /**
     * return a DateUtil Object 
     * @param {units} units the units to add/subtract
     * @return {Object}
     */
     Constructor.prototype.msFromNow = function(units) {
        return new DateUtil(timestampMath(fromNowString(units, 'ms'), this.timestamp));
    }

    Constructor.prototype.secsFromNow = function(units) {
        return new DateUtil(timestampMath(fromNowString(units, 's'), this.timestamp));
    }

    Constructor.prototype.minsFromNow = function(units) {
        return new DateUtil(timestampMath(fromNowString(units, 'i'), this.timestamp));
    }

    Constructor.prototype.daysFromNow = function(units) {
        return new DateUtil(timestampMath(fromNowString(units, 'd'), this.timestamp));
    }

    Constructor.prototype.weeksFromNow = function(units) {
        return new DateUtil(timestampMath(fromNowString(units, 'w'), this.timestamp));
    }

    Constructor.prototype.monthsFromNow = function(units) {
        return new DateUtil(timestampMath(fromNowString(units, 'm'), this.timestamp));
    }

    Constructor.prototype.yearsFromNow = function(units) {
        return new DateUtil(timestampMath(fromNowString(units, 'y'), this.timestamp));
    }

    return Constructor;

}) ();
