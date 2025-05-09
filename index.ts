import express from "express";
import bodyParser from "body-parser";
import { start } from "./Endpoints/start.js";
import { tournament } from "./Endpoints/tournament.js";
import { move } from "./Endpoints/move.js";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.post("/Move", (req, res) => {
  move(req, res);
});

app.post("/Start", (req, res) => {
  start(req, res);
});

app.post("/Tournament", (req, res) => {
  tournament(req, res);
});

app.listen(port, () => {
  console.log(`GameServer listening on port ${port}`);
});
