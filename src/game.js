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
   * @type {Object} - Tracks each player's choices and stats
   */
  playersStats = {};

  /**
   * @constructor
   * @param {Server} server
   */
  constructor(server) {
    this.server = server;
  }

  /**
   * Reset all player stats when starting a new game or round
   */
  resetStats() {
    this.playersStats = {};  // Clear all player data
    console.log("Player stats have been reset");
  }

  /**
   * Send the new turn to all clients
   */
  sendNewTurn() {
    this.server.emit("newTurn", this.turnNumber);
    this.turnNumber += 1;
  }

  /**
   * Handle when a player plays their turn
   * @param {string} userId - The unique user identifier
   * @param {number} turn - The current turn number
   * @param {string} choice - The player's choice
   */
  onPlayerPlayed(userId, turn, choice) {
    console.log(`Player ${userId} has played ${choice} at turn ${turn}`);

    // If the player doesn't exist in the stats object, initialize them
    if (!this.playersStats[userId]) {
      this.playersStats[userId] = {
        choices: [],
        dead: false
      };
    }

    this.playersStats[userId].choices.push({ turn, choice });
  }

  /**
   * Get all players and their choices
   * @returns {Object} - The players' choices and stats
   */
  getAllPlayerStats() {
    return this.playersStats;
  }

  /**
   * Start the game (round 0)
   * Reset stats at the start of the game or round
   */
  startGame() {
    this.resetStats();  // Reset stats when starting a new game
    console.log("Game has started! All player stats are reset.");
  }

  sendEndGame() { }
}

export default GameServer;
