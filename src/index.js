import express from 'express';
import { createServer } from 'node:http';
import { join, dirname } from 'node:path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const server = createServer(app);
const io = new Server(server);

app
  .set("view engine", "ejs")
  .set("views", join(__dirname, 'presentation'))
  .use(express.static(join(__dirname, 'presentation/static')));


app.get('/', (_req, res) => {
  res.render("pages/index", { title: "KAAAAAAAAAAAAAACPER" })
});

io.on("connection", (socket) => {
  console.log(socket.id);
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
