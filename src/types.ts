import { JourneysOptions } from 'hafas-client';

export type BaahnFormatString = readonly string[];
export type BaahnAnswer = {
  origin: string,
  destination: string,
  when: Date,
  whenType: 'departure' | 'arrival',
};
export type BaahnQuery = {
  from: string,
  to: string,
  opt: JourneysOptions,
};
