// import type { Request, Response } from "express";
// import gameTypes, { type gameTitle } from "../games/index.js";
//
// export function move(req: Request, res: Response) {
//   console.log(req.body);
//   if (
//     !req.body ||
//     !req.body?.move == undefined ||
//     !req.body?.passcode ||
//     !req.body?.apiKey
//   ) {
//     res.sendStatus(400);
//     return;
//   }
//
//   const { move, passcode, apiKey, gameType, playerID } = req.body;
//   console.log(req.body);
//   gameTypes[gameType as gameTitle].recieveMove(move, passcode, playerID);
//
//   res.send(JSON.stringify("Move received" + JSON.stringify(req.body)));
// }
