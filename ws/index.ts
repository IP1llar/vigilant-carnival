import WebSocket, { WebSocketServer } from "ws";
import { handleMessage } from "./message.js";
const apiKey = process.argv[2] || "1";

const connections: Record<string, WebSocket> = {};

const wss = new WebSocketServer({
  port: 8080,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3,
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024,
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024, // Size (in bytes) below which messages
    // should not be compressed if context takeover is disabled.
  },
});
wss.on("error", console.error);
wss.on("connection", function connection(ws, req) {
  console.log(
    "Connection from",
    req.socket.remoteAddress,
    req.socket.remotePort,
  );
  ws.on("message", handleMessage(ws));
});
