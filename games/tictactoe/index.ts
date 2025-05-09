import type {
  gameInterface,
  gameSettings,
  passcode,
  player,
} from "../../game.js";
import {
  sendGameStateToPlayer,
  sendResultToPlayer,
} from "../../helpers/sendDataREST.js";

const activeGames: Record<passcode, game> = {};

type game = {
  state: gameState;
  settings: gameSettings;
  turn: number;
  active: boolean;
};
type gameState = [tile, tile, tile, tile, tile, tile, tile, tile, tile];
type tile = "-" | "O" | "X";

function emptyGameState(): gameState {
  return ["-", "-", "-", "-", "-", "-", "-", "-", "-"];
}

function initialise(gameSettings: gameSettings) {
  const newGame: game = {
    state: emptyGameState(),
    settings: gameSettings,
    turn: 0,
    active: true,
  };
  activeGames[gameSettings.passcode] = newGame;

  sendGameState(newGame);
}

async function sendGameState(game: game) {
  let player = game.settings.players[0] as player;
  if (game.turn % 2 == 1) {
    player = game.settings.players[1] as player;
  }

  const body = {
    token: getToken(game),
    gameState: game.state,
  };

  sendGameStateToPlayer(player, body);
}

async function recieveMove(move: number, passcode: passcode) {
  // TODO: Check it's the correct player?
  console.log("Move recieved", move);
  const game = activeGames[passcode] as game;
  if (!game.active) {
    console.log("Move recieved for finished game");
    return;
  }
  if (!validateMove(move, game)) {
    console.log("bad move", move, game.state);
    throw Error("bad move");
  }
  performMove(move, game);
  if (isWin(game)) {
    informWinner(game);
    return;
  }

  game.turn++;

  if (game.turn >= 9) {
    informDraw(game);
    return;
  }

  sendGameState(game);
}

function getToken(game: game) {
  return game.turn % 2 ? "X" : "O";
}

function validateMove(move: number, game: game) {
  if (move > 9 || move < 0) return false;
  return game.state[move] == "-";
}

function performMove(move: number, game: game) {
  const token = getToken(game);
  game.state[move] = token;
}

function isWin(game: game) {
  const state = game.state;
  for (let i = 0; i < 3; i++) {
    if (
      state[0 + i * 3] == state[1 + i * 3] &&
      state[1 + i * 3] == state[2 + i * 3] &&
      state[0 + i * 3] !== "-"
    )
      return true;
    if (
      state[0 + i] == state[3 + i] &&
      state[3 + i] == state[6 + i] &&
      state[0 + i] !== "-"
    )
      return true;
  }
  const dia1 = state[0] == state[4] && state[4] == state[8] && state[0] !== "-";
  const dia2 = state[2] == state[4] && state[4] == state[6] && state[2] !== "-";
  return dia1 || dia2;
}

async function informWinner(game: game) {
  let winner = game.settings.players[0] as player;
  let loser = game.settings.players[1] as player;
  if (game.turn % 2 == 1) {
    winner = game.settings.players[1] as player;
    loser = game.settings.players[0] as player;
  }

  console.log(
    "sending result, winner is:",
    game.turn % 2 == 1 ? "player 2" : "player 1",
  );
  sendResultToPlayer(winner, "Winner", game.state);
  sendResultToPlayer(loser, "Loser", game.state);
}

async function informDraw(game: game) {
  console.log("sending result: Draw");
  game.settings.players.forEach((player) => {
    sendResultToPlayer(player, "Draw", game.state);
  });
}

const Tictactoe: gameInterface = {
  initialise,
  players: 2,
  recieveMove,
};
export default Tictactoe;
