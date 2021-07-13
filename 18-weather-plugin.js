var WeatherPlugin = function (options) {

	"use strict";

	// Default settings
	var defaults = {
		selector: '#app',
		apiKey: '',
		icon: true,
		units: 'I',
		cacheTime: 15,
		ts: Date.now(),
		lat: '',
		lon: '',
		weather: {}
	};

	// Merge user options into defaults
	var settings = Object.assign({}, defaults, options);
	console.log(settings);

	const app = document.querySelector(settings.selector);
	let apiURL = 'https://api.weatherbit.io/v2.0/current/?key=';
	let unitMap = {
		I: {temp: '&deg;F', wind: 'mph', precip: 'in'},
		M: {temp: '&deg;C', wind: 'm/s', precip: 'mm'},
		S: {temp: '&deg;K', wind: 'm/s', precip: 'mm'}
	};

	/**
	 * Sanitize and encode all HTML in a user-submitted string
	 * https://portswigger.net/web-security/cross-site-scripting/preventing
	 * @param  {String} str  The user-submitted string
	 * @return {String} str  The sanitized string
	 */
	 function sanitizeHTML (str) {
		return str.replace(/javascript:/gi, '').replace(/[^\w-_. ]/gi, function (c) {
			return `&#${c.charCodeAt(0)};`;
		});
	}

	/**
	 * Log an error message
	 * @param  {Object} error The error details
	 */
	function locationError (error) {
		console.warn('locationError', error);
		status = checkStorage();
		renderWeather(status);
	}

	let fetchAPI = async function (position) {
		settings.lon = position.coords.longitude || '';
		settings.lat = position.coords.latitude || '';

		let uri = `${apiURL}${settings.apiKey}&lat=${settings.lat}&lon=${settings.lon}&units=${settings.units}`;

		if (checkStorage() == true) {
			renderWeather(true);
		}
		else {

			try {
				console.log('fetchAPI data', settings, uri);
				let response = await fetch(uri);
				// If the response is successful, get the JSON
				if (!response.ok) {
					throw 'Something went wrong with fetch()';
				}
				console.log('fetchAPI response', response);
				let data = await response.json();

				// This is the JSON from our response
				settings.ts = Date.now();
				settings.weather = data.data[0];
				localStorage.setItem('project18Weather', JSON.stringify(settings));
				renderWeather(true);
			}
			catch (error) {
				// There was an error
				console.warn('fetchAPI catch()', error);
				renderWeather(false);
			}
		}
	}

	const checkStorage = function () {
		let cacheCheck = Date.now();
		
		// Get the data
		let savedData = JSON.parse(localStorage.getItem('project18Weather'));
		console.log('checkStorage', cacheCheck, savedData);

		if (settings.units != savedData.units) {
			return false;
		}
		if (settings.lat != savedData.lat || settings.lon != savedData.lon) {
			return false;
		}
		if (savedData && (cacheCheck <= savedData.ts + (15*60*1000))) {
			// 15 minute cache age
			console.log('checkStorage savedData', savedData);
			settings = savedData;
			return true;
		}
		else {
			return false;
		}
	}

	const renderWeather = function(status) {
		console.log('renderWeather', status, settings);
		if (!status) {
			app.innerText = 'No location available, update the form below'
		}
		else {
			let icon = '';
			if (settings.weather.weather.icon) {
				icon = `<img class="icon" src="https://www.weatherbit.io/static/img/icons/${settings.weather.weather.icon}.png" />`;
			}
			
			app.innerHTML = `
			<p>The weather in ${settings.weather.city_name}, ${settings.weather.state_code} is</p>
			<table class="weather">
				<tr><td>Outlook</td><td>${icon} ${settings.weather.weather.description}</td></tr>
				<tr><td>Current Temp.</td><td>${settings.weather.temp} ${unitMap[settings.units].temp}</td></tr>
				<tr><td>Feels Like</td><td>${settings.weather.app_temp}</td></tr>
				<tr><td>Wind Speed</td><td>${settings.weather.wind_spd} ${unitMap[settings.units].wind}</td></tr>
				<tr><td>Wind Direction</td><td>${settings.weather.wind_cdir}</td></tr>
			</table>`;
		}

	}

	// Request access to the user's location
	if('geolocation' in navigator) {
		navigator.geolocation.getCurrentPosition(fetchAPI, locationError, {
			timeout: 6000,  
			maximumAge: 2500
		});
	} 
}
