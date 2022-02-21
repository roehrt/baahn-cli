import fs from 'fs';
import ora from 'ora';
import chalk from 'chalk';
import { findJourneys } from '@roehrt/baahn';

import * as questions from './lib/questions';
import { formatJourneys } from './lib/format';

const packageInfo = JSON.parse(fs.readFileSync('../package.json', 'utf-8'));

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
      const journeys = await findJourneys(from, to, opt);
      spinner.succeed();

      spinner = ora({
        text: 'Format journeys',
        color: 'green',
      }).start();
      const formatted = formatJourneys(journeys);
      spinner.succeed();
      console.log(formatted);
    } catch (e) {
      if (e instanceof Error) spinner.fail(e.message);
    }
  }).catch((e) => console.error(`Failed with: ${e.message}`));
}
