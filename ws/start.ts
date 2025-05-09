import type { Request, Response } from "express";
import type { gamecode, gameSettings, player } from "../game.js";
import gameTypes from "../games/index.js";
const games: Record<gamecode, gameSettings> = {};

export function start(req: Request, res: Response) {
  // TODO: Extract into game.ts
  if (
    !req.body?.gameKey ||
    !req.body?.returnURL ||
    !req.body?.gameType ||
    !req.body?.apiKey
  ) {
    res.sendStatus(400);
    return;
  }

  // TODO: use apiKey
  const { gameKey, apiKey, returnURL, gameType } = req.body;
  console.log("request url", req.url);
  let activePlayer = undefined;
  // match game
  // find game exists
  let game = games[gameKey];
  if (!game) {
    const passcode = crypto.randomUUID();
    const playerID = crypto.randomUUID();
    const player: player = {
      returnURL,
      playerID,
      playerNumber: 1,
    };
    activePlayer = player;
    const newGame: gameSettings = {
      passcode,
      gameType: gameType,
      players: [player],
    };
    games[gameKey] = newGame;
  } else {
    const playerID = crypto.randomUUID();
    if (game.players.length >= gameTypes[game.gameType].players) {
      console.log("Too many players", games[gameKey]);
      res.sendStatus(400);
      return;
    }
    if (game.players.some((player) => player.returnURL === returnURL)) {
      console.log("Duplicate player");
      res.sendStatus(400);
      return;
    }
    if (game.gameType != gameType) {
      console.log("Game type incorrect:", gameType, "Expected:", game.gameType);
    }
    const player2: player = {
      returnURL,
      playerID,
      playerNumber: game.players.length + 1,
    };
    game.players.push(player2);
    activePlayer = player2;
  }
  game = games[gameKey] as gameSettings;
  const returnBody = {
    passcode: game?.passcode,
    playerID: activePlayer.playerID,
    playerNumber: activePlayer.playerNumber,
  };

  res.send(JSON.stringify(returnBody));

  if (game.players.length == gameTypes[game.gameType].players) {
    console.log("initialising", game.gameType);
    console.log(game);
    gameTypes[game.gameType].initialise(game);
  }
}
