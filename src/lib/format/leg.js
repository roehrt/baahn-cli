const emoji = require('node-emoji');
const chalk = require('chalk');

const node = chalk.gray('•');
const bar = chalk.gray('|');
const arrow = chalk.gray(' →  ');

function formatDelay(delay) {
	if (delay == null) return '';
	delay /= 60;
	if (delay <= 5) {
		return chalk.green('+' + delay);
	}
	return chalk.red('+' + delay);
}

function formatTime(time) {
	time = new Date(time);
	return ('0' + time.getHours()).slice(-2) + ':' +
      ('0' + time.getMinutes()).slice(-2);
}

function renderLeg(leg, gray = false) {
	const departureDelay = formatDelay(leg.departureDelay);
	const arrivalDelay = formatDelay(leg.arrivalDelay);
	let legString = [
		[
			node,
			chalk.bold(formatTime(leg.plannedDeparture)) + departureDelay,
			leg.origin.name,
		],
		[bar, renderProduct(leg)],
		[
			node,
			chalk.bold(formatTime(leg.plannedArrival)) + arrivalDelay,
			leg.destination.name,
		],
	];
	if (gray) {
		legString = legString.map(sub => [chalk.gray(sub.join(' '))]);
	}

	return legString;
}

function renderProduct(leg) {
	// ensure no gender symbol is shown
	if (leg.walking) return emoji.get('walking').slice(0, 2) +
      chalk.gray(' Walk');
	if (leg && leg.line && leg.line.product) {
		const s = leg.line.name + arrow + leg.direction;
		if (s) return chalk.gray(s);
	}
	return chalk.gray('?');
}

module.exports = {
	renderLeg,
};
