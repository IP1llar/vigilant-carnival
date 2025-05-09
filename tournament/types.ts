import type { gameTitle } from "../games/index.ts";
import type { ObjectValues } from "../helpers/objectValues.ts";
export type tournamentSettings = {
  numberOfPlayers: number;
  gameType: gameTitle;
  tournamentType: tournamentType;
  bestOf: number;
  displayType: displayType;
  credentials: credentials;
  credentialDir: string;
  tournamentID: string;
  seeding: seeding;
  seedingDir: string;
};

export const TOURNAMENT_TYPE = {
  roundRobin: "roundRobin",
  singleElimination: "singleElimination",
  doubleElimination: "doubleElimination",
} as const;
export type tournamentType = ObjectValues<typeof TOURNAMENT_TYPE>;

export const DISPLAY_TYPE = {
  oneAtATime: "oneAtATime",
  simultaneousRounds: "simultaneousRounds",
  nonStop: "nonStop",
} as const;
export type displayType = ObjectValues<typeof DISPLAY_TYPE>;

export const CREDENTIALS = {
  acceptAnyApiKey: "acceptAnyApiKey",
  apiKeysFromFile: "apiKeysFromFile",
} as const;
export type credentials = ObjectValues<typeof CREDENTIALS>;

export const SEEDING = {
  random: "random",
  fromFile: "fromFile",
} as const;
export type seeding = ObjectValues<typeof SEEDING>;

export type team = { apiKey: string; name: string };
export type seed = { apiKey: string; name: string; rank: number };
