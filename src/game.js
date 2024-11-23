import { Server } from 'socket.io';

class GameServer {

  /**
   * @private
   */
  server;

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
  */
  constructor(server) {
    this.server = server;
  }

  sendNewTurn() {
    this.server.emit("newTurn", this.turnNumber);
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
