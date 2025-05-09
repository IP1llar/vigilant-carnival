import { input, number, select } from "@inquirer/prompts";
import gameTypes from "../../games/index.js";
import fileSelector from "inquirer-file-selector";
import { readFile } from "node:fs/promises";
import {
  CREDENTIALS,
  DISPLAY_TYPE,
  SEEDING,
  TOURNAMENT_TYPE,
} from "../../tournament/types.js";
import type { tournamentSettings } from "../../tournament/types.js";
import { validateAPIKeyList } from "../../helpers/validateAPIKeyList.js";
import { validateSeedingList } from "../../helpers/validateSeedingList.js";
import { createTournament } from "../../tournament/index.js";

export async function beginTournament() {
  const numberOfPlayers = await number({
    message: "Number of players",
    min: 2,
    required: true,
  });
  const gameType = await select({
    message: "Choose type of game",
    choices: typeOfGameOptions,
  });
  const tournamentType = await select({
    message: "Choose type of tournament",
    choices: typeOfTournamentOptions,
  });
  const bestOf = await number({
    message: "Choose best of",
    min: 1,
    required: true,
  });
  const seeding = await select({
    message: "Choose seeding",
    choices: seedingOptions,
  });
  let seedingDir = "";
  if (seeding === SEEDING.fromFile) {
    let validFile = false;
    while (!validFile) {
      seedingDir = await fileSelector({
        message: "Select a file:",
        type: "file",
        filter: (item) => item.path.includes(".json") || item.isDirectory(),
      });
      validFile = await validateSeedingFile(seedingDir);
    }
  }
  const displayType = await select({
    message: "Choose display type",
    choices: displayTypeOptions,
  });
  const credentialsChoice = await select({
    message: "Choose API keys",
    choices: credentialsOptions,
  });
  let credentialDir = "";
  if (credentialsChoice == "apiKeysFromFile") {
    let validFile = false;
    while (!validFile) {
      credentialDir = await fileSelector({
        message: "Select a file:",
        type: "file",
        filter: (item) => item.path.includes(".json") || item.isDirectory(),
      });
      validFile = await validateCredentialFile(credentialDir, numberOfPlayers);
    }
  }
  const tournamentIDChoice = (await select({
    message: "Choose TournamentID",
    choices: tournamentIDOptions,
  })) as tournamentIDOptions;
  const tournamentID = await chooseTournamentID(tournamentIDChoice);
  console.log("TournamentID chosen:", tournamentID);

  const tournamentSettings: tournamentSettings = {
    numberOfPlayers,
    gameType,
    tournamentType,
    bestOf,
    displayType,
    credentials: credentialsChoice,
    credentialDir,
    tournamentID,
    seeding,
    seedingDir,
  };
  console.log(tournamentSettings);
  createTournament(tournamentSettings);
}

function mapIntoChoices(l: any[]) {
  return l.map((a) => {
    return { value: a, name: a };
  });
}

const games = Object.keys(gameTypes);
const typeOfGameOptions = mapIntoChoices(games);

const tournaments = Object.keys(TOURNAMENT_TYPE);
const typeOfTournamentOptions = mapIntoChoices(tournaments);

const displayTypes = Object.keys(DISPLAY_TYPE);
const displayTypeOptions = mapIntoChoices(displayTypes);

const credentials = Object.keys(CREDENTIALS);
const credentialsOptions = mapIntoChoices(credentials);

const seeding = Object.keys(SEEDING);
const seedingOptions = mapIntoChoices(seeding);

const validateCredentialFile = validateFile(validateAPIKeyList);
const validateSeedingFile = validateFile(validateSeedingList);

function validateFile(validator: (list: any[]) => boolean) {
  return async (fileDir: string, numberOfPlayers?: number) => {
    try {
      let contents = await readFile(fileDir);
      let unvalidatedList = JSON.parse(contents.toString());
      if (numberOfPlayers && numberOfPlayers > unvalidatedList.length) {
        return false;
      }
      let result = validator(unvalidatedList);
      if (!result) {
        console.log("Invalid file");
      }
      return unvalidatedList.length;
    } catch {
      return false;
    }
  };
}

const tournamentID = ["GenerateRandomID", "SelectID"];
type tournamentIDOptions = "GenerateRandomID" | "SelectID";
const tournamentIDOptions = mapIntoChoices(tournamentID);

async function chooseTournamentID(tournamentIDChoice: tournamentIDOptions) {
  if (tournamentIDChoice === "GenerateRandomID") {
    return crypto.randomUUID().slice(0, 8);
  }
  if (tournamentIDChoice === "SelectID") {
    return await input({ message: "Enter tournament ID:", required: true });
  }
  return "";
}
