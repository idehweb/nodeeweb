import { createTerminus } from "@godaddy/terminus";
import mongoose from "mongoose";
import { Server } from "http";

export default function gracefullyShutdown(server: Server) {
  process.once("uncaughtException", (err) => {
    console.log("#uncaughtException:", err);
    shutdown();
  });
  process.once("unhandledRejection", (err) => {
    console.log("#unhandledRejection:", err);
    shutdown();
  });
  function shutdown() {
    server.close(async () => {
      try {
        await onSignal();
      } catch (err) {}
      process.exit(1);
    });
  }
  async function onSignal() {
    await Promise.all(mongoose.connections.map((c) => c.close()));
  }
  async function onHealthcheck() {
    const status = mongoose.connections.every((c) => c.readyState === 1);
    if (!status) throw new Error("DB not connect yet!");
  }

  createTerminus(server, {
    healthChecks: { "/health": onHealthcheck },
    onSignal,
    signals: ["SIGINT", "SIGTERM"],
    useExit0: true,
  });
}
