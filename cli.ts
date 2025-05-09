import { select } from "@inquirer/prompts";
import { beginTournament } from "./cli/beginTournament/index.js";
import { openGames } from "./cli/openGames/index.js";
import { tournamentResults } from "./cli/tournamentResults/index.js";
import { changeTeamDetails } from "./cli/changeTeamDetails/index.js";
import { generateAPIKeys } from "./cli/generateAPIKeys/index.js";

async function go() {
  welcomeMessage();
  const toplevelChoice = await select({
    message: "Choose an option",
    choices: toplevelOptions,
  });
  await toplevelChoice();
}

type Choice<Value> = {
  value: Value;
  name?: string;
  description?: string;
  short?: string;
  disabled?: boolean | string;
  type?: never;
};

const toplevelOptions: Choice<() => Promise<void>>[] = [
  {
    value: beginTournament,
    name: "Begin Tournament",
  },
  {
    value: openGames,
    name: "Open for Games",
  },
  {
    value: tournamentResults,
    name: "See Tournament Results",
  },
  {
    value: changeTeamDetails,
    name: "Change Team Details",
  },
  {
    value: generateAPIKeys,
    name: "Generate API Keys",
  },
];

function welcomeMessage() {
  console.log("Welcome");
}

go();

process.on("uncaughtException", (error) => {
  if (error instanceof Error && error.name === "ExitPromptError") {
    console.log("👋 until next time!");
  } else {
    // Rethrow unknown errors
    throw error;
  }
});
