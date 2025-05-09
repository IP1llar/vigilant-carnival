import type { gameInterface } from "../game.js";
import Arboretum from "./Arboretum/index.js";
import Suits from "./Suits/index.js";
import Tictactoe from "./tictactoe/index.js";

const gameTypes: Record<gameTitle, gameInterface> = {
  arboretum: Arboretum,
  tictactoe: Tictactoe,
  suits: Suits,
};

export type gameTitle = "arboretum" | "tictactoe" | "suits";
export default gameTypes;
