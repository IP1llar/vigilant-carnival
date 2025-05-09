/** player */
export type player = {
  returnURL: string;
  playerID: string;
  playerNumber: number;
};

export type tournamentPlayer = {
  returnURL: string;
  apiKey: string;
};

/** Games */
export type gameType = "arboretum";

/** code to be passed assign game */
export type gamecode = string;

/** apiKey */
export type apiKey = string;

/** game passcode */
export type passcode = string;

/** playerID */
export type playerID = string;

export type gameSettings = {
  passcode: gamecode;
  gameType: gameType;
  players: player[];
};

export type gameInterface = {
  initialise: (gameSettings: gameSettings) => void;
  players: number;
  recieveMove: (move: any, passcode: passcode, playerID: playerID) => void;
};
