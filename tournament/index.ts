import { confirm } from "@inquirer/prompts";
import type { apiKey, tournamentPlayer } from "../game.js";
import { beginAPI } from "./api.js";
import {
  CREDENTIALS,
  SEEDING,
  type seed,
  type team,
  type tournamentSettings,
} from "./types.js";
import { readFile } from "fs/promises";

const players: Record<apiKey, tournamentPlayer> = {};
let teams: Record<apiKey, team> = {};
let seeding: Record<number, apiKey> = {};

export async function createTournament(settings: tournamentSettings) {
  // Load APIKeys
  if (settings.credentials === CREDENTIALS.apiKeysFromFile) {
    let contents = await readFile(settings.credentialDir);
    let data = JSON.parse(contents.toString());
    for (let team of data as unknown as team[]) {
      teams[data.apiKey] = team;
    }
  }
  // Display beginning tournament and tournamentID
  console.log(
    "Beginning tournament, opening with tournament id:",
    settings.tournamentID,
  );
  // Open Ports
  // Await players loading in
  await new Promise((complete) =>
    beginAPI(3000, teams, players, complete, settings),
  );
  //
  // Once ready - confirm to begin
  await confirm({ message: "Ready to begin?" });
  // Load seeding
  if (settings.seeding === SEEDING.fromFile) {
    let contents = await readFile(settings.seedingDir);
    let data = JSON.parse(contents.toString()) as seed[];
    for (let seed of data) {
      seeding[seed.rank] = seed.apiKey;
    }
  }
  // Load tournament type

  // Loop:
  //    Begin round
  //    Assess results
  //    Calculate next round
  // End
  //
  // Show results
}
