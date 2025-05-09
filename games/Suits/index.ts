// Suits
// 2 decks faceup
// Take in in turns to draw 2 cards
// The most of certain suits (black player 1, red player 2) when either deck is empty wins

import type {
  gameSettings,
  gameInterface,
  playerID,
  passcode,
  player,
} from "../../game.js";
import {
  sendGameStateToPlayer,
  sendResultToPlayer,
} from "../../helpers/sendDataREST.js";

const activeGames: Record<passcode, game> = {};

type gameState = {
  decks: [string[], string[]];
  hands: [string[], string[]];
};

type game = {
  state: gameState;
  settings: gameSettings;
  turn: number;
  subturn: number;
  active: boolean;
};

const suits = ["D", "C", "H", "S"];

function createDecks(): [string[], string[]] {
  let deck = [];
  for (let i = 1; i < 14; i++) {
    for (let j = 0; j < suits.length; j++) {
      let card = faceCard(i) + (suits[j] as string);
      deck.push(card);
    }
  }
  shuffle(deck);
  let deck1 = deck.slice(0, deck.length / 2);
  let deck2 = deck.slice(deck.length / 2, deck.length);
  console.log(deck1, deck2);
  return [deck1, deck2];
}

function faceCard(value: number) {
  if (value == 11) {
    return "J";
  }
  if (value == 12) {
    return "Q";
  }
  if (value == 13) {
    return "K";
  }
  return value;
}

function initialise(gameSettings: gameSettings) {
  const decks = createDecks();
  const hands: [string[], string[]] = [[], []];
  const newGame: game = {
    state: {
      decks,
      hands,
    },
    settings: gameSettings,
    turn: 0,
    subturn: 0,
    active: true,
  };

  activeGames[gameSettings.passcode] = newGame;

  sendGameState(newGame);
}

function sendGameState(game: game) {
  const [currentPlayer, nextPlayer] = getCurrentPlayer(game);
  const visibleCards = [game.state.decks[0][0], game.state.decks[1][0]];
  function makeBody(active: boolean) {
    return {
      gameState: visibleCards,
      active,
    };
  }

  sendGameStateToPlayer(currentPlayer as player, makeBody(true));
  sendGameStateToPlayer(nextPlayer as player, makeBody(false));
}

function getCurrentPlayer(game: game) {
  let player = game.settings.players[0] as player;
  let nextPlayer = game.settings.players[1] as player;
  if (game.turn % 2 == 1) {
    player = game.settings.players[1] as player;
    nextPlayer = game.settings.players[0] as player;
  }
  return [player, nextPlayer];
}

function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function recieveMove(move: number, passcode: passcode, playerID: playerID) {
  console.log(move, passcode, playerID);
  const game = activeGames[passcode] as game;
  if (!checkPlayerTurn(playerID, game)) {
    console.log("Out of turn");
    return;
  }
  if (!game.active) {
    console.log("Move recieved for finished game");
    return;
  }
  if (!validateMove(move)) {
    console.log("bad move", move, game.state);
    throw Error("bad move");
  }
  performMove(move, game);
  if (isWin(game)) {
    informWinner(game);
    return;
  }

  if (game.subturn === 1) {
    game.turn++;
    game.subturn = 0;
  } else {
    game.subturn = 1;
  }

  sendGameState(game);
}

function checkPlayerTurn(playerID: string, game: game) {
  const currentTurn = game.turn % 2;
  console.log("Checking player turn");
  console.log("CurrentTurn", game.turn, currentTurn);
  console.log("playerID", playerID);
  console.log(game.settings.players);
  return game.settings.players[currentTurn]?.playerID === playerID;
}

function performMove(move: number, game: game) {
  const card = game.state.decks[move]?.shift() as string;
  const player = game.turn % 2;
  game.state.hands[player]?.push(card);
}

function isWin(game: game) {
  return game.state.decks.some((deck) => deck.length == 0);
}

function validateMove(move: number) {
  return move == 0 || move == 1;
}

function informWinner(game: game) {
  const p1Suits = game.state.hands[0].reduce(
    (prev, card) => prev + (card.includes("C") || card.includes("S") ? 1 : 0),
  );
  const p2Suits = game.state.hands[1].reduce(
    (prev, card) => prev + (card.includes("H") || card.includes("D") ? 1 : 0),
  );
  let winner = game.settings.players[0] as player;
  let win = "player1";
  let loser = game.settings.players[1] as player;
  if (p2Suits > p1Suits) {
    winner = game.settings.players[1] as player;
    loser = game.settings.players[0] as player;
    win = "player2";
  }

  if (p1Suits == p2Suits) {
    informDraw(game);
    return;
  }

  console.log("sending result, winner is: ", win);
  sendResultToPlayer(winner, "Winner", game.state.hands);
  sendResultToPlayer(loser, "Loser", game.state.hands);
}

function informDraw(game: game) {
  console.log("sending result, it is a draw");
  game.settings.players.forEach((player) => {
    sendResultToPlayer(player, "Draw", game.state.hands);
  });
}

const Hearts: gameInterface = {
  initialise,
  players: 2,
  recieveMove,
};
export default Hearts;
