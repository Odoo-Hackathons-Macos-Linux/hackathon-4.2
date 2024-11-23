import express from 'express';
import { createServer } from 'node:http';
import { join, dirname } from 'node:path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'node:url';
import GameServer from './game.js';
import { Database } from './database.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const server = createServer(app);
const io = new Server(server);
const gameInstance = new GameServer(io, new Database("tg.db"));

setInterval(() => {
  console.log("Sending new turn")
  gameInstance.sendNewTurn();
}, 15 * 1000);

app
  .set("view engine", "ejs")
  .set("views", join(__dirname, "presentation"))
  .use(express.static(join(__dirname, "presentation/static")));

app.get("/", (_req, res) => {
  res.render("pages/index", { eventTypes: "None" });
});

app.get("/card", (_req, res) => {
  let eventTypes = [
    "None",
    "Famine",
    "Attack",
    "Storm",
    "Kidnapping",
    "Loot",
    "Package",
    "Fire",
  ];
  let id = 4;
  res.render("pages/card", {
    eventTypes: eventTypes[id],
  });
});

io.on("connection", (socket) => {
  console.log("Socket connected: " + socket.id);

  // When a player plays their turn, receive their userId, turn, and choice
  socket.on("played", (userId, turn, choice) => {
    console.log(`Player ${userId} made a choice: ${choice} on turn ${turn}`);

    // Pass the userId, turn, and choice to the GameServer's method
    gameInstance.onPlayerPlayed(userId, turn, choice);
  });

  // You can also track disconnect events and do cleanup (if necessary)
  socket.on("disconnect", () => {
    console.log("Socket disconnected: " + socket.id);
  });
});


server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});


export { gameInstance };
