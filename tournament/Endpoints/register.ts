import type { Request, Response } from "express";
import type { apiKey, player, tournamentPlayer } from "../../game.js";
import type { gameTitle } from "../../games/index.js";
import { CREDENTIALS, type team, type tournamentSettings } from "../types.js";

let playerCount = 0;

type tournament = {
  tournamentID: string;
  players: player[];
  game: gameTitle;
  maxplayers: number;
};

const players: player[] = [];

export function register(
  req: Request,
  res: Response,
  players: Record<apiKey, tournamentPlayer>,
  allowedKeys: Record<apiKey, team>,
  settings: tournamentSettings,
  complete: (value: unknown) => void,
) {
  if (!req.body?.returnURL || !req.body?.apiKey || !req.body?.tournamentID) {
    res.sendStatus(400);
    return;
  }
  // TODO: use apiKey
  const { apiKey, returnURL, tournamentID } = req.body;
  if (tournamentID !== settings.tournamentID) {
    console.log("Invalid tournamentID", tournamentID);
    res.sendStatus(400);
    return;
  }

  if (
    settings.credentials === CREDENTIALS.apiKeysFromFile &&
    !allowedKeys[apiKey]
  ) {
    console.log("Invalid apiKey", apiKey);
    res.sendStatus(400);
    return;
  }

  if (players[apiKey]) {
    console.log("Player already joined");
    res.sendStatus(400);
    return;
  }

  const player: tournamentPlayer = {
    returnURL,
    apiKey,
  };

  players[apiKey] = player;
  playerCount++;
  if (settings.credentials === CREDENTIALS.apiKeysFromFile) {
    console.log(allowedKeys[apiKey], "joined");
  } else {
    console.log(playerCount, "joined");
  }
  res.send(200);
  if (playerCount === settings.numberOfPlayers) {
    complete(playerCount);
  }
}
