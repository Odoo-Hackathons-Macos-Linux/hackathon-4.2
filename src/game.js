import { Server } from 'socket.io';
import { Database } from './database';

class GameServer {

  /**
   * @private
   */
  server;

  /**
   * @private
   * @type {Database}
   */
  db

  /**
   * @type {number}
   */
  turnNumber = 0;

  /**
   * @type {number}
   */
  playersAlive;

  /**
   * @type {Array<number>}
   */
  events;

  /**
   * @type {number}
   */
  currentEvent;

  /**
  * @constructor
  * @param {Server} server
  * @param {Database} db
  */
  constructor(server, db) {
    this.server = server;
    this.db = db;
  }

  sendNewTurn() {
    let data = this.db.getTurnData(1);
    this.server.emit("newTurn", this.turnNumber, data);
    this.turnNumber += 1;
  }

  /**
   * @param {string} id
   */
  sendDead(id) {
    const socket = this.server.sockets.sockets.get(id);
    if (socket) {
      socket.emit("dead");
    }
  }

  sendEndGame() { }

  /**
   * @param {string} id
   * @param {number} turn
   * @param {number} choice
  */
  onPlayerPlayed(id, turn, choice) {
    console.log(`Client ${id} has played ${choice} at turn ${turn}`);
  }
}

export default GameServer;
