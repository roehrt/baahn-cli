import { Leg } from 'hafas-client';

import chalk from 'chalk';
import emoji from 'node-emoji';

import { BaahnFormatString } from '@/types';

const node = chalk.gray('•');
const bar = chalk.gray('|');
const arrow = chalk.gray(' →  ');

function formatDelay(delay: number | undefined) {
  if (typeof delay !== 'number') return '';
  delay /= 60;
  if (delay <= 5) return chalk.green(`+${delay}`);
  return chalk.red(`+${delay}`);
}

function formatTime(time: string | undefined) {
  if (!time) return '??:??';
  const parsedTime = new Date(time);
  return `${(`0${parsedTime.getHours()}`).slice(-2)}:${
    (`0${parsedTime.getMinutes()}`).slice(-2)}`;
}

function renderProduct(leg: Leg) {
  if (leg.walking) {
    return emoji.get('walking').slice(0, 2)
      + chalk.gray(' Walk');
  }
  if (leg && leg.line && leg.line.product) {
    const s = leg.line.name + arrow + leg.direction;
    if (s) return chalk.gray(s);
  }
  return chalk.gray('?');
}

export function renderLeg(leg: Leg, gray = false): BaahnFormatString[] {
  const departureDelay = formatDelay(leg.departureDelay);
  const arrivalDelay = formatDelay(leg.arrivalDelay);

  let legFormatString = [
    [
      node,
      chalk.bold(formatTime(leg.plannedDeparture)) + departureDelay,
      leg.origin?.name ?? '??',
    ],
    [bar, renderProduct(leg)],
    [
      node,
      chalk.bold(formatTime(leg.plannedArrival)) + arrivalDelay,
      leg.destination?.name ?? '??',
    ],
  ];

  if (gray) {
    legFormatString = legFormatString.map((sub) => [chalk.gray(sub.join(' '))]);
  }

  return legFormatString;
}
