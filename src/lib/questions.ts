import createClient, { Station } from 'hafas-client';
// @ts-ignore
import dbProfile from 'hafas-client/p/db';

import inquirer from 'inquirer';
import inquirerAutocompletePrompt from 'inquirer-autocomplete-prompt';
// @ts-ignore
import inquirerDatepicker from 'inquirer-datepicker';

import { BaahnAnswer, BaahnQuery } from '@/types';

const dbClient = createClient(dbProfile, 'baahn-cli');

function fetchStops(query: string): Promise<readonly Station[]> {
  return dbClient.locations(query, {
    results: 3,
    addresses: false,
    poi: false,
    subStops: false,
    entrances: false,
  }) as Promise<readonly Station[]>;
}

async function fetchSuggestions(query: string): Promise<string[]> {
  if (!query) return [];
  const stops = await fetchStops(query);
  return stops.map((stop) => stop.name ?? 'An error occurred');
}

async function fetchStationId(stationName: string): Promise<string> {
  const stops = await fetchStops(stationName);
  if (!stops[0].id) throw Error(`Unable to fetch the station id of ${stationName}`);
  return stops[0].id;
}

inquirer.registerPrompt('autocomplete', inquirerAutocompletePrompt);
inquirer.registerPrompt('datepicker', inquirerDatepicker);

const questions = (now: Date) => [
  {
    type: 'autocomplete',
    name: 'origin',
    message: 'origin',
    source: (_prev: string, text: string) => fetchSuggestions(text),
  }, {
    type: 'autocomplete',
    name: 'destination',
    message: 'destination',
    source: (_prev: string, text: string) => fetchSuggestions(text),
  }, {
    type: 'datepicker',
    name: 'when',
    message: 'when',
    format: ['DD', '.', 'MM', '.', 'Y', ' ', 'HH', ':', 'mm'],
    default: () => new Date(),
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

export const ask = () => inquirer.prompt(questions(new Date()));

export async function toConfig(response: BaahnAnswer): Promise<BaahnQuery> {
  return {
    from: (await fetchStationId(response.origin)),
    to: (await fetchStationId(response.destination)),
    opt: {
      [response.whenType]: response.when,
      results: 10,
    },
  };
}
