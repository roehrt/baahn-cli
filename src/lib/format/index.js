const chalk = require('chalk');
const {renderLeg} = require('./leg');

const padding = ' '.repeat(2);
const separator = chalk.cyan.bold('='.repeat(25));

module.exports = function formatJourneys(journeys) {
	const lines = [];
	lines.push([]);
	lines.push([chalk.bold('Your search results')]);
	for (const journey of journeys) {
		lines.push([]);
		lines.push([separator]);
		lines.push([]);
		const price = [];
		const color = journey.trick ? 'green' : 'yellow';
		price.push('Preis:');
		price.push(chalk.bold[color](journey.price.amount.toFixed(2) + ' €'));
		if (journey.trick) {
			price.push(chalk.red.strikethrough(
				`${journey.trick.oldPrice.toFixed(2)} €`),
			);
		}

		lines.push(price);
		lines.push([]);

		if (journey.trick) {
			for (const leg of journey.trick.prepend) {
				lines.push(...renderLeg(leg, true));
			}
			if (journey.trick.prepend.length > 0) {
				lines.push([]);
				lines.push([chalk.bold('Reise beginnen')]);
				lines.push([]);
			}
		}

		for (const leg of journey.legs) {
			lines.push(...renderLeg(leg));
		}

		if (journey.trick) {
			if (journey.trick.append.length > 0) {
				lines.push([]);
				lines.push([chalk.bold('Reise beenden')]);
				lines.push([]);
			}
			for (const leg of journey.trick.append) {
				lines.push(...renderLeg(leg, true));
			}
		}
	}
	lines.push([]);
	return lines.map(sub => padding + sub.join(' ')).join('\n');
};
