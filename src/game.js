import { Server } from 'socket.io';
import { Database } from './database.js';

class GameState {
  /** 
   * @type {number}
   */
  water = 20;

  /** 
    * @type {number}
    */
  waterCap = 30;

  /** 
   * @type {number}
   */
  food = 20;

  /** 
    * @type {number}
    */
  foodCap = 30;

  /** 
  * @type {number}
  */
  wood = 0;

  /** 
    * @type {number}
    */
  woodCap = 20;

  /**
  * @type {number}
  */
  fire = 0;

  /**
   * @type {Object} safety
   * @type {number} safety.shulter
   * @type {number} safety.fences
   */
  safety = {
    shulter: 0,
    fences: 0,
  }

  /**
  * @type {Object} technology
  * @type {number} technology.tools
  * @type {number} technology.transports
  * @type {number} technology.safety
  * @type {number} technology.agriculture
  */
  technology = {
    tools: 0,
    transports: 0,
    safety: 0,
    agriculture: 0,

  }
}

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
   * @private
   * @type {GameState}
  state;
  
  /**
   * @type {number}
   */
  turnNumber = 1;

  turnEvent;

  /**
   * @type {Object} - Tracks each player's choices and stats
   */
  playersStats = {};


  /**
  * @constructor
  * @param {Server} server
  * @param {Database} db
  */
  constructor(server, db) {
    this.server = server;
    this.db = db;
    this.state = new GameState();

    // db.init()
  }

  /**
   * Reset all player stats when starting a new game or round
   */
  resetStats() {
    this.playersStats = {};  // Clear all player data
    this.state = new GameState();
    this.turnNumber = 1;
    console.log("Player stats have been reset");
  }



  /**
   * Send the new turn to all clients
   */
  sendNewTurn() {
    let eventId = 0;

    if (this.turnNumber >= 3) {
      eventId = Math.floor(Math.random() * 7);
    }

    this.turnEvent = eventId + 1; // Entre 1 et 8 :)

    let data = this.db.getTurnData(this.turnEvent);
    console.log("Event id : " + this.turnEvent);
    if (this.turnEvent == 6) {
      let alivePlayers = Object.values(this.playersStats).filter(player => player.status !== "dead");

      if (alivePlayers.length > 0) {
        this.playersStats[alivePlayers[Math.floor(Math.random() * alivePlayers.length)].id].status = "kidnapped";
      }
      console.log(this.playersStats);
    }
    if (this.turnEvent == 8) {
      let alivePlayers = Object.values(this.playersStats).filter(player => player.status !== "dead");
      let randoms = [];
      for (let i = 0; i < Math.floor(Math.random() * alivePlayers.length / 8); i++) {
        randoms.push(Math.floor(Math.random() * alivePlayers.length));
      }
      for (let random of randoms) {
        this.playersStats[alivePlayers[random].id].status = "sick";
      }
      console.log(this.playersStats);
    }
    this.server.emit("newTurn", this.turnNumber, data, this.playersStats);
    this.turnNumber += 1;

    setTimeout(() => {
      this.calculateRound();
      this.server.emit("dataInfo", this.turnNumber, this.getGameData());
    }, 15.2 * 1000);
  }

  calculateRound() {
    let playerLaterStats = [];
    let hasCooked = false;
    let event = 0;

    // if (Object.entries(this.playersStats).length == 0) {
    //   this.sendNewTurn();
    //   return;
    // }

    for (const [id, player] of Object.entries(this.playersStats)) {
      console.log(player.choices.find(choice => choice.turn === this.turnNumber)); // Faut trouver une solution en fonction du tour. Certains ne vous pas avoir de valeurs donc via Hashmap ?
      if (!player.choices.find(choice => choice.turn === this.turnNumber)) {
        console.log(player.id + " -> Is dead");
        break;
      }
      console.log(player.choices.find(choice => choice.turn === this.turnNumber).val);
      switch (player.choices.find(choice => choice.turn === this.turnNumber).val) {
        case 1: { // water
          let newWater = this.state.water + 2;
          if (newWater > this.state.waterCap) newWater = this.state.waterCap;

          this.state.water = newWater;
          break;
        }
        case 2: { // plants
          let newFood = this.state.food + (1.5 + 1.5 * ((this.state.technology.agriculture / 10) >= 1 ? 1 : (this.state.technology.agriculture / 10)));
          if (newFood > this.state.foodCap) newFood = this.state.foodCap;

          this.state.food = newFood;
          break
        }
        case 3: { // fishing
          let chance = Math.random();
          let newFood;
          if (chance > 0.8) {
            newFood = this.state.food + (2.5 + 2.5 * ((this.state.technology.tools / 10) >= 1 ? 1 : (this.state.technology.tools / 10)));
          } else if (chance > 0.6) {
            newFood = this.state.food + (1.5 + 1.5 * ((this.state.technology.tools / 10) >= 1 ? 1 : (this.state.technology.tools / 10)));
          } else if (chance > 0.4) {
            newFood = this.state.food + (1 + 1 * ((this.state.technology.tools / 10) >= 1 ? 1 : (this.state.technology.tools / 10)));
          } else {
            newFood = this.state.food + (0.5 + 0.5 * ((this.state.technology.tools / 10) >= 1 ? 1 : (this.state.technology.tools / 10)));
          }
          if (newFood > this.state.foodCap) newFood = this.state.foodCap;

          this.state.food = newFood;
          break
        }
        case 4: { // wood
          let newWood = this.state.wood + (1 + 1 * ((this.state.technology.tools / 10) >= 1 ? 1 : (this.state.technology.tools / 10)));
          if (newWood > this.state.woodCap) newWood = this.state.woodCap;

          this.state.wood = newWood;
          break
        }
        case 5: { // cooking
          hasCooked = true;
          break
        }
        case 10: { // water++
          if (Math.random() < 0.15) {
            this.playersStats[player.id].status = "dead";
            if (!this.getPlayerAlive()) { return this.sendEndGame() };
            break;
          }

          let newWater = this.state.water + (3 + 3 * ((this.state.technology.transports / 10) >= 1 ? 1 : (this.state.technology.transports / 10)));
          if (newWater > this.state.waterCap) newWater = this.state.waterCap;

          this.state.water = newWater;

          break
        }
        case 11: { // wood++
          if (Math.random() < 0.15) {
            this.playersStats[player.id].status = "dead";
            if (!this.getPlayerAlive()) { return this.sendEndGame() };
            break;
          }

          let newWood = this.state.wood + (2.5 + 2.5 * ((this.state.technology.transports / 10) >= 1 ? 1 : (this.state.technology.transports / 10)));
          if (newWood > this.state.woodCap) newWood = this.state.woodCap;

          this.state.wood = newWood;

          break
        }
        case 12: { // loot
          if (Math.random() < 0.25) {
            this.playersStats[player.id].status = "dead";
            if (!this.getPlayerAlive()) { return this.sendEndGame() };
            break;
          }

          let loots = ["food", "wood", "water"];
          loots.sort(function (a, b) {
            return Math.random() - 0.5;
          });
          let amountOfDifferentLoots = Math.floor(Math.random() * 3);
          let lootForPlayer = loots.slice(0, amountOfDifferentLoots + 1);
          for (let loot of lootForPlayer) {
            switch (loot) {
              case "food": {
                let newFood = this.state.food + (Math.random() * 4) + 1;
                if (newFood > this.state.foodCap) newFood = this.state.foodCap;
                this.state.food = newFood;

                break
              }
              case "wood": {
                let newWood = this.state.wood + (Math.random() * 2.5) + 1;
                if (newWood > this.state.woodCap) newWood = this.state.woodCap;
                this.state.wood = newWood;
                break
              }
              case "water": {
                let newWater = this.state.water + (Math.random() * 3) + 1;
                if (newWater > this.state.waterCap) newWater = this.state.waterCap;
                this.state.water = newWater;
                break
              }
            }
          }
          break
        }
        case 13: { // hunting
          if (Math.random() < 0.20) {
            this.playersStats[player.id].status = "dead";
            if (!this.getPlayerAlive()) { return this.sendEndGame() };
          }

          let chance = Math.random();
          let newFood;
          if (chance > 0.8) {
            newFood = this.state.food + (3.5 + 3.5 * ((this.state.technology.transports / 10) >= 1 ? 1 : (this.state.technology.transports / 10)));
          } else if (chance > 0.6) {
            newFood = this.state.food + (2.5 + 2.5 * ((this.state.technology.transports / 10) >= 1 ? 1 : (this.state.technology.transports / 10)));
          } else if (chance > 0.4) {
            newFood = this.state.food + (2 + 2 * ((this.state.technology.transports / 10) >= 1 ? 1 : (this.state.technology.transports / 10)));
          } else if (chance > 0.2) {
            newFood = this.state.food + (1.5 + 1.5 * ((this.state.technology.transports / 10) >= 1 ? 1 : (this.state.technology.transports / 10)));
          } else {
            newFood = this.state.food + (1 + 1 * ((this.state.technology.transports / 10) >= 1 ? 1 : (this.state.technology.transports / 10)));
          }
          if (newFood > this.state.foodCap) newFood = this.state.foodCap;

          this.state.food = newFood;

          break
        }
        case 14: { // tools
          this.state.technology.tools += 1;
          break
        }
        case 15: { // transports
          this.state.technology.transports += 1;
          break
        }
        case 16: { // security
          this.state.technology.security += 1;
          break
        }
        case 17: { // agriculture
          this.state.technology.agriculture += 1;
          break
        }
        case 18: { // save
          event += 1;
          break
        }
        case 19: { // firefighter
          event += 1;
          break
        }
        case 20: { // antidote
          event += 1;
          break
        }

        default: {
          playerLaterStats.push(player.choices.find(choice => choice.turn === this.turnNumber).val);
        }
      }
    }

    for (let player of playerLaterStats) {
      switch (player) {
        case 6: { // shulter
          if (this.state.wood >= 3) {
            this.state.safety.shulter += 1;
            this.state.wood -= 3;
          }
          break
        }
        case 7: { // fire
          if (this.state.wood >= 1) {
            this.state.fire += 1;
            this.state.wood -= 1;
          }
          break
        }
        case 8: { // fences 
          if (this.state.wood >= 2) {
            this.state.safety.fences += 1;
            this.state.wood -= 2;
          }
          break
        }
        case 9: { // storage
          if (this.state.wood >= 5) {
            this.state.woodCap += 5;
            this.state.foodCap += 5;
            this.state.waterCap += 5;

            this.state.wood = 3;
          }
          break
        }

      }
    }

    // handle user consumption
    let alivePlayers = Object.values(this.playersStats).filter(player => player.status !== "dead");
    let famineIndex = 1;
    switch (this.turnEvent) {
      case 1: {
        // normal
        break;
      }
      case 2: {
        // famine
        famineIndex = 1.5;
        break;
      }
      case 3: {
        // attack
        if (this.state.safety.fences < 5) {
          this.playersStats[alivePlayers[Math.floor(Math.random() * alivePlayers.length)].id].status = "dead";
          if (!this.getPlayerAlive()) { return this.sendEndGame() };
        }
        break;
      }
      case 4: {
        // storm
        if (this.state.safety.shulter < 2) {
          if (Object.values(this.playersStats).filter(x => x.status == "alive").length > 3) {
            this.playersStats[alivePlayers[Math.floor(Math.random() * alivePlayers.length)].id].status = "dead";
          }
          if (!this.getPlayerAlive()) { return this.sendEndGame() };
          this.state.fire = 0;
          this.state.safety.shulter -= 1;
          this.state.water += 5;
        } else {
          this.state.fire = 0;
          this.state.safety.shulter -= 1;
          this.state.water += 8;
        }
        break;
      }
      case 5: {
        // loot box
        this.state.water += 6;
        this.state.food += 7;
        break;
      }
      case 6: {
        // kidnap
        const kidnappedPeople = Object.values(this.playersStats).filter(player => player.status === "kidnapped");
        if (event < alivePlayers.length / 10) {
          for (let player of kidnappedPeople) {
            this.playersStats[player.id].status = "dead";
            if (!this.getPlayerAlive()) { return this.sendEndGame() };
          }
        } else {
          for (let player of kidnappedPeople) {
            this.playersStats[player.id].status = "alive";
          }
        }
        break;
      }
      case 7: {
        // incendie
        if (event < alivePlayers.length / 8) {
          this.state.wood -= 6;
          if (this.state.wood < 0) {
            this.state.wood = 0;
          }
          this.state.waterCap -= 5;
          this.state.woodCap -= 5;
          this.state.foodCap -= 5;
          this.state.safety.shulter -= 1;
          this.state.safety.fence -= 1;
        }
        break;
      } case 8: {
        let sickPlayers = Object.values(this.playersStats).filter(player => player.status === "sick");
        if (event < alivePlayers.length / 10) {
          this.playersStats[sickPlayers[Math.floor(Math.random() * sickPlayers.length)].id].status = "dead";
          if (!this.getPlayerAlive()) { return this.sendEndGame() };
        }
        break;
      }
    }

    let sickPlayers = Object.values(this.playersStats).filter(player => player.status === "sick");
    for (let player of sickPlayers) {
      player.status = "alive";
    }

    alivePlayers = Object.values(this.playersStats).filter(player => player.status !== "dead");
    if (!hasCooked && alivePlayers.length > 3) {
      let randoms = [];
      for (let i = 0; i < Math.floor(Math.random() * alivePlayers.length / 8); i++) {
        randoms.push(Math.floor(Math.random() * alivePlayers.length));
      }
      for (let random of randoms) {
        this.playersStats[alivePlayers[random].id].status = "sick";
      }
    }
    for (let player of alivePlayers) {
      this.state.water -= 1 * famineIndex;
      this.state.food -= 1 * famineIndex;
    }

    let deadWaterCount = 0;
    let deadFoodCount = 0;

    if (this.state.water < 0) {
      deadWaterCount -= this.state.water;
      this.state.water = 0;
    }
    if (this.state.food < 0) {
      deadFoodCount -= this.state.food;
      this.state.food = 0;
    }



    if (deadWaterCount > deadFoodCount) {
      // Tuer les gens
      let randoms = [];
      for (let i = 0; i < deadWaterCount; i++) {
        randoms.push(Math.floor(Math.random() * alivePlayers.length));
      }
      for (let random of randoms) {
        this.playersStats[alivePlayers[random].id].status = "dead";
        if (!this.getPlayerAlive()) { return this.sendEndGame() };
      }
    } else {
      // Tuer des gens
      let randoms = [];
      for (let i = 0; i < deadFoodCount; i++) {
        randoms.push(Math.floor(Math.random() * alivePlayers.length));
      }
      for (let random of randoms) {
        this.playersStats[alivePlayers[random].id].status = "dead";
        if (!this.getPlayerAlive()) { return this.sendEndGame() };
      }
    }
    console.log(this.playersStats);
    // this.sendNewTurn();
  }

  /**
   * Handle when a player plays their turn
   * @param {string} userId - The unique user identifier
   * @param {number} turn - The current turn number
   * @param {string} choice - The player's choice
   */
  onPlayerPlayed(userId, turn, choice) {
    console.log(`Player ${userId} has played ${choice} at turn ${turn}`);

    if (turn != this.turnNumber - 1) return;
    // If the player doesn't exist in the stats object, initialize them
    if (!this.playersStats[userId]) {
      this.playersStats[userId] = {
        id: userId,
        choices: [],
        status: "alive"
      };
    }
    this.playersStats[userId].choices.push({ val: choice, turn: this.turnNumber });
  }

  /**
   * Get all players and their choices
   * @returns {Object} - The players' choices and stats
   */
  getAllPlayerStats() {
    return this.playersStats;
  }

  getPlayerAlive() {
    return Object.values(this.playersStats).filter(player => player.status === "alive").length > 0;
  }

  sendEndGame() {
    console.log(this.playersStats);
    console.log("sendEndGame (everybody died)");
    this.server.emit("endGame", this.playersStats, this.db.getPersonnalityData());
  }

  getGameData() {
    let alivePlayers = Object.values(this.playersStats).filter(player => player.status == "alive");
    let sickPlayers = Object.values(this.playersStats).filter(player => player.status == "sick");
    let kidnappedPlayers = Object.values(this.playersStats).filter(player => player.status == "kidnapped");
    let deadPlayers = Object.values(this.playersStats).filter(player => player.status == "dead");
    let totalPlayers = Object.values(this.playersStats).filter(player => player.status !== "dead");
    let data = [this.state.water, this.state.food, this.state.wood, this.state.fire];
    let dataMin = [totalPlayers, totalPlayers, 0, 0];
    let data2 = [alivePlayers.length, sickPlayers.length, kidnappedPlayers.length, deadPlayers.length];
    return [data, data2, dataMin];
  }
}

export default GameServer;
