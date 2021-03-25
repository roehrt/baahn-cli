#!/usr/bin/env node

const packageInfo = require('../package.json');
const {findJourneys} = require('@roehrt/baahn');
const questions = require('./lib/questions');
const formatJourneys = require('./lib/format');
const ora = require('ora');
const chalk = require('chalk');

if(require.main === module) {
	console.log(chalk.gray(packageInfo.name+'@'+packageInfo.version));
	questions.ask().then(async (answers) => {
		let spinner = ora('Parse parameters').start();
		try {
			const {from, to, opt} = await questions.toConfig(answers);
			spinner.succeed();

			spinner = ora({
				text: 'Search journeys',
				color: 'yellow'
			}).start();
			const response = await findJourneys(from, to, opt);
			spinner.succeed();

			spinner = ora({
				text: 'Format journeys',
				color: 'green'
			}).start();
			const output = formatJourneys(response);
			spinner.succeed();
			console.log(output);
		} catch (e) {
			spinner.fail(e.message);
		}
	}).catch((e) => console.error('Failed with: ' + e.message));
}
