import WebSocket from "ws";
// This is a ws proxy
// Exposes correct REST endpoints and sends on to server via websockets

const serverConnection = process.argv[2];
const port = process.argv[3];

let wsOpen = false;

if (!serverConnection) {
  throw Error("no url for server");
}
const ws = new WebSocket(serverConnection);

ws.on("error", console.error);
ws.on("open", () => {
  wsOpen = true;
});

import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());
app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.post("/Move", (req, res) => {});

app.post("/Start", (req, res) => {});

app.post("/Tournament", (req, res) => {});

app.listen(port, () => {
  console.log(`GameServer listening on port ${port}`);
});
