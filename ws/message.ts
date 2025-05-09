import WebSocket from "ws";
import type { ObjectValues } from "../helpers/objectValues.js";
export function handleMessage(ws: WebSocket) {
  return function (unparsedData: WebSocket.RawData) {
    try {
      let sData = unparsedData.toString();
      const data = JSON.parse(sData);
      console.log(data);

      switch (data.type) {
        case (MESSAGETYPES.connect):

          break;
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        ws.send("Invalid syntax");
      }
      console.log(err);
    }
  };
}

function validateMessage(data: any) {
  // TODO: validateFunction for every type
  return MESSAGETYPES[data.type as messageType] !== undefined && data.apiKey;
}

const MESSAGETYPES = {
  connect: "connect",
} as const;

type messageType = ObjectValues<typeof MESSAGETYPES>;
