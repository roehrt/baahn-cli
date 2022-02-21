import { BaahnJourney } from '@roehrt/baahn';

import chalk from 'chalk';
import { BaahnFormatString } from '@/types';
import { renderLeg } from './leg';

const INDENT = ' '.repeat(2);
const SEPARATOR: readonly string[] = [chalk.cyan.bold('='.repeat(25))];
const NEWLINE: readonly[] = [];

function formatPrice(journey: BaahnJourney): BaahnFormatString {
  const price = [];
  const color = journey.trick ? 'green' : 'yellow';
  price.push('Price:');
  price.push(chalk.bold[color](`${journey.price?.amount?.toFixed(2)} €`));
  if (journey.trick) {
    price.push(chalk.red.strikethrough(
      `${journey.trick.oldPrice.toFixed(2)} €`,
    ));
  }
  return price;
}

function formatJourney(journey: BaahnJourney): BaahnFormatString[] {
  const lines = [];
  lines.push(formatPrice(journey));
  lines.push(NEWLINE);

  if (journey.trick) {
    for (const leg of journey.trick.prepend) {
      lines.push(...renderLeg(leg, true));
    }
    if (journey.trick.prepend.length > 0) {
      lines.push(NEWLINE);
      lines.push([chalk.bold('Start journey here')]);
      lines.push(NEWLINE);
    }
  }

  for (const leg of journey.legs) {
    lines.push(...renderLeg(leg));
  }

  if (journey.trick) {
    if (journey.trick.append.length > 0) {
      lines.push(NEWLINE);
      lines.push([chalk.bold('End journey here')]);
      lines.push(NEWLINE);
    }
    for (const leg of journey.trick.append) {
      lines.push(...renderLeg(leg, true));
    }
  }

  return lines;
}

export function formatJourneys(journeys: BaahnJourney[]): string {
  const lines = [];
  lines.push([]);
  lines.push([chalk.bold('Your search results')]);
  for (const journey of journeys) {
    lines.push(NEWLINE);
    lines.push(SEPARATOR);
    lines.push(NEWLINE);
    lines.push(...formatJourney(journey));
  }
  lines.push([]);
  return lines.map((sub) => INDENT + sub.join(' ')).join('\n');
}
