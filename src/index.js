import express from 'express';
import { createServer } from 'node:http';
import { join, dirname } from 'node:path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'node:url';
import GameServer from './game.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const server = createServer(app);
const io = new Server(server);
const gameInstance = new GameServer(io);

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

  socket.on("played", (turn, choice) => gameInstance.onPlayerPlayed(socket.id, turn, choice));
});


server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});


export { gameInstance };
