import type { gameInterface, gameSettings } from "../../game.js";

async function initialise(gameSettings: gameSettings) {
  console.log("Game");
  new Promise((res) =>
    setTimeout(() => {
      console.log("game began");
      res(true);
    }, 5000),
  );
  const response = await fetch(gameSettings.players[0]?.returnURL || "");
  const value = await response.json();
  console.log(value);
}

const Arboretum: gameInterface = {
  initialise,
  players: 2,
  recieveMove: () => {},
};

export default Arboretum;
