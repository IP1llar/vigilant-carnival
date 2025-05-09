import express, { type Express } from "express";
import bodyParser from "body-parser";
import { start } from "./Endpoints/start.js";
import { register } from "./Endpoints/register.js";
import { move } from "./Endpoints/move.js";
import type { apiKey, tournamentPlayer } from "../game.js";
import type { team, tournamentSettings } from "./types.js";

export async function beginAPI(
  port: number,
  allowedKeys: Record<apiKey, team>,
  players: Record<apiKey, tournamentPlayer>,
  complete: (value: unknown) => void,
  settings: tournamentSettings,
) {
  const app = express();

  app.use(bodyParser.json());
  app.get("/", (_req, res) => {
    res.send("Hello World!");
  });

  app.post("/Register", (req, res) => {
    console.log(req.body);
    register(req, res, players, allowedKeys, settings, complete);
  });

  app.listen(port, () => {
    console.log(`GameServer listening on port ${port}`);
  });
}

export function beginGames(app: Express) {
  app.post("/Move", (req, res) => {
    move(req, res);
  });

  app.post("/Start", (req, res) => {
    start(req, res);
  });
}
