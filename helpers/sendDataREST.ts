import type { player, playerID, passcode } from "../game.js";

export async function sendToPlayer<T>(
  player: player,
  endpoint: string,
  body: T,
) {
  return await fetch(player.returnURL + endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export async function sendGameStateToPlayer<T>(player: player, gameState: T) {
  return sendToPlayer(player, "/GameState", gameState);
}

export async function sendResultToPlayer<T>(
  player: player,
  result: "Winner" | "Loser" | "Draw",
  finalState: T,
) {
  return sendToPlayer(player, "/GameOver", {
    result,
    finalState,
  });
}

export async function sendNewGameToPlayer(
  player: player,
  passcode: passcode,
  playerNumber: number,
  playerID: playerID,
) {
  return sendToPlayer(player, "/NewGame", {
    passcode,
    playerNumber,
    playerID,
  });
}
