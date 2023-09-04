import express from "express";
import expressWs from "express-ws";
import { ConditionBasedWsData, WsAuthorization } from "../helpers/websocket.js";

const wsRouter = express.Router();
expressWs(wsRouter);

// @route   WS /ws?token=<jwt>
// @desc    Get unread notification count
// @access  Private
wsRouter.ws("/", async (ws, req) => {
  const { token } = req.query;

  try {
    const { _id, role, features } = await WsAuthorization(token);
    if (!_id) ws.close(1000, "Authentication failed");

    ws.on("message", async (msg) =>
      ws.send(
        JSON.stringify(
          await ConditionBasedWsData(JSON.parse(msg), role, _id, features)
        )
      )
    );

    ws.on("close", () => ws.close(1000, "Connection closed by user"));
  } catch (error) {
    return ws.close(1000, `error: ${error}`);
  }
});

export default wsRouter;
