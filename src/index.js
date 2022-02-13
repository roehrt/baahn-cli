#!/usr/bin/env node

const { findJourneys } = require('@roehrt/baahn');
const ora = require('ora');
const chalk = require('chalk');
const packageInfo = require('../package.json');
const questions = require('./lib/questions');
const formatJourneys = require('./lib/format');

if (require.main === module) {
  console.log(chalk.gray(`${packageInfo.name}@${packageInfo.version}`));
  questions.ask().then(async (answers) => {
    let spinner = ora('Parse parameters').start();
    try {
      const { from, to, opt } = await questions.toConfig(answers);
      spinner.succeed();

      spinner = ora({
        text: 'Search journeys',
        color: 'yellow',
      }).start();
      const response = await findJourneys(from, to, opt);
      spinner.succeed();

      spinner = ora({
        text: 'Format journeys',
        color: 'green',
      }).start();
      const output = formatJourneys(response);
      spinner.succeed();
      console.log(output);
    } catch (e) {
      spinner.fail(e.message);
    }
  }).catch((e) => console.error(`Failed with: ${e.message}`));
}
