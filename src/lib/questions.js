const hafas = require('db-hafas')('baahn-cli');
const inquirer = require('inquirer');
const inquirer_autocomplete_prompt = require('inquirer-autocomplete-prompt');
const inquirer_datepicker = require('inquirer-datepicker');

function fetchStops(query) {
	return hafas.locations(query, {
		results: 3,
		addresses: false,
		poi: false,
		subStops: false,
		entrances: false,
	});
}

async function fetchSuggestions(query) {
	if (!query) return [];
	const stops = await fetchStops(query);
	return stops.map(stop => stop.name);
}

async function fetchStationId(stationName) {
	const stops = await fetchStops(stationName);
	return stops[0].id;
}

inquirer.registerPrompt('autocomplete', inquirer_autocomplete_prompt);
inquirer.registerPrompt('datepicker', inquirer_datepicker);

const questions = (now) => [
	{
		type: 'autocomplete',
		name: 'origin',
		message: 'origin',
		source: (a, b) => fetchSuggestions(b),
	}, {
		type: 'autocomplete',
		name: 'destination',
		message: 'destination',
		source: (a, b) => fetchSuggestions(b),
	}, {
		type: 'datepicker',
		name: 'when',
		message: 'when',
		format: ['DD', '.', 'MM', '.', 'Y', ' ', 'HH', ':', 'mm'],
		default: new Date(),
		min: {
			year: now.getFullYear(),
			month: now.getMonth() + 1,
			day: now.getDate(),
			hour: now.getHours(),
			minute: now.getMinutes(),
		},
	}, {
		type: 'list',
		name: 'whenType',
		message: 'arrival or departure',
		choices: [
			'departure',
			'arrival',
		],
	},
];

function ask() {
	return inquirer.prompt(questions(new Date()));
}

async function toConfig(response) {
	return {
		from: (await fetchStationId(response.origin)),
		to: (await fetchStationId(response.destination)),
		opt: {
			[response.whenType]: response.when,
			results: 10,
		},
	};
}

module.exports = {
	ask,
	toConfig,
};
