import type { Request, Response } from "express";
import type { player } from "../game.js";
import type { gameTitle } from "../games/index.js";

const maxplayers = 2;

const tournaments: tournament[] = [];

type tournament = {
  tournamentID: string;
  players: player[];
  game: gameTitle;
  maxplayers: number;
};

const players: player[] = [];

export function tournament(req: Request, res: Response) {
  // Players access this endpoint to join a tournament
  // How do we set up tournament?
  // Tournament has an ID
  // This endpoint verifies ID is correct and enters player into tournament
  // When tournament is full - allocates players to games and starts rounds
  // Types of tournament:
  //    - Knockout
  //    - Double elimination
  //    - RoundRobin/League
  //    - Combination
  //    - Ladder?
}
