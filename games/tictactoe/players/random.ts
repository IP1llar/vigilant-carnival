import express from "express";
import bodyParser from "body-parser";
const app = express();
const port = process.argv[2];
const gameKey = Number(process.argv[3]);
const gameType = "tictactoe";
let passcode = "1";

app.use(bodyParser.json());

app.get("/", (_req, res) => {
  console.log("Contact made from server");
  res.send(`"Success from port ${port}"`);
});

app.post("/GameState", (req, res) => {
  console.log(req.body);

  res.send("nice");
  const move = pickMove(req.body.gameState);
  fetch("http://localhost:3000" + "/Move", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      passcode,
      move,
      gameType,
      apiKey: 1,
    }),
  })
    .then((res) => res.json())
    .then((body) => console.log(body));
});

function pickMove(state: ("-" | "X" | "O")[]) {
  let choice = Math.floor(9 * Math.random());
  while (state[choice] !== "-") {
    choice = Math.floor(9 * Math.random());
  }
  return choice;
}

app.post("/GameOver", (req, res) => {
  console.log(req.body);
  res.send(200);
  process.exit();
});

app.listen(port, () => {
  console.log(`Player listening on port ${port}`);
});

function start() {
  fetch("http://localhost:3000" + "/Start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      gameKey,
      gameType,
      apiKey: 1,
      returnURL: "http://localhost:" + port,
    }),
  })
    .then((res) => res.json())
    .then((body: any) => (passcode = body.passcode));
}

start();
