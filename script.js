/**
 * Hello, this is a simple board game.
 *
 * @author  Miguel
 * @version 1.0
 * @since
*/

class Board {
  constructor(id, mapName) {
    this.id = id;
    this.mapName = mapName;
    this.grid = [
      [1, 0, 0, 1, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 1, 1, 1],
      [1, 1, 0, 2, 0, 1, 1],
      [1, 1, 1, 0, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 1, 0, 0, 1]
    ];
    this.players = [];
  }
  /**
   * Returns the value of the indicated cell from the board grid.
   * @param  y the value of the coord in the Y axis (vertical).
   * @param  x the value of the coord in the X axis (horizontal).
   * @return the value of a single cell.
   */
  getCellValue(y, x) {
    return this.grid[y][x];
  }
  /**
   * Transforms the cell value id into the value of its Y axis.
   * @param  id the id of the cell.
   * @return the value of the coord Y.
   */
  transformIdToCoordY(id) {
    return id.split("-")[0];
  }
  /**
   * Transforms the cell value id into the value of its X axis.
   * @param  id the id of the cell.
   * @return the value of the coord X.
   */
  transformIdToCoordX(id) {
    return id.split("-")[1];
  }
  /**
   * Obtains the id from the cell based on its coords.
   * @param  y the value of the coord Y.
   * @param  x the value of the coord X.
   * @return the cell id.
   */
  obtainCellId(y, x) {
    return y + "-" + x;
  }
  /**
   * Searches the player on the map and returns its Y axis position.
   * @param  playerName the name of player that will be search.
   * @return the Y coords where the player was found.
   */
  getCoordinatePlayerY(playerName) {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        if (this.grid[i][j] == playerName) return i;
      }
    }
  }
  /**
   * Searches the player on the map and returns its X axis position.
   * @param  playerName the name of player that will be search.
   * @return the X coords where the player was found.
   */
  getCoordinatePlayerX(playerName) {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        if (this.grid[i][j] == playerName) return j;
      }
    }
  }
  /**
   * Searches the alive players in the map.
   * @return returns an array with the names of the players who are alive.
   */
  getAlivePlayerNames() {
    let playersAlive = [];
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        let cell = this.grid[i][j];
        if (cell != 0 && cell != 1 && cell != 2 && cell != 5 && cell != 6) {
          playersAlive.push(cell);
        }
      }
    }
    return playersAlive;
  }
  /**
   * Searches a player by the name.
   * @param  namePlayer the name of the player.
   * @return returns an array with the names of the players who are alive.
   */
  getPlayerByName(namePlayer) {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].name == namePlayer) return this.players[i];
    }
  }
  /**
   * Assigns the corresponding class to the map cells according to its value,
   * and bind player details interface.
   */
  showCurrentGrid() {
    const tile = document.querySelectorAll(".tile");
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        let currentTile = tile[i * this.grid.length + j];
        currentTile.innerHTML = this.grid[i][j];

        switch (currentTile.innerHTML) {
          case "0": {
            // Non-playable tile
            currentTile.className = "tile jungle";
            break;
          }
          case "1": {
            // Playable tile
            currentTile.className = "tile";
            break;
          }
          case "2": {
            // Object tile
            currentTile.className = "tile object";
            break;
          }
        
          case "5": {
            // Pre-movement
            currentTile.className = "tile movAvailable";
            break;
          }
          case "6": {
            // Pre-attack
            currentTile.className = "tile attackAvailable";

            break;
          }
          default: {
            currentTile.onclick = "";
            // Preventing no class Tile
            if (currentTile.classList == "") {
              currentTile.className = "tile";
            }
            // Assing to each player its properly team class in case
            // that was removed and bind the player details triggers.
            this.players.forEach(function(player) {
              if (
                currentTile.innerHTML == player.name &&
                currentTile.classList.length == 1
              ) {
                if (player.team == team[0]) {
                  currentTile.className = "tile teamOne";
                }
                if (player.team == team[1]) {
                  currentTile.className = "tile teamTwo";
                }
                currentTile.onmousemove = function() {
                  showPlayerDetails(player);
                };
                currentTile.onmouseout = function() {
                  hidePlayerDetails();
                };
              }
            });
          }
        }
      }
    }
  }
  /**
   * Changes the value of a cell with pre-attack
   * or pre-movement into a playable cell.
   */
  restoreMap() {
    const cell = document.querySelectorAll(".tile");
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        // If the cell is marked by available mov/attack.
        if (
          cell[i * this.grid.length + j].innerHTML == "5" ||
          cell[i * this.grid.length + j].innerHTML == "6"
        ) {
          this.grid[i][j] = 1; // Playable cell value.
        }
        // If the cell is a marked player (tile + team + mark).
        if (cell[i * this.grid.length + j].classList.length >= 3) {
          cell[i * this.grid.length + j].className = "tile";
        }
      }
    }
    this.showCurrentGrid();
  }
  /**
   * Adds a player into the map with the player coords.
   * @param  player the inserted player.
   */
  insertPlayer(player) {
    this.grid[player.position.y][player.position.x] = player.name;
    this.players.push(player);
  }
  /**
   * Moves a player to the indicated coords cell.
   * @param  player the inserted player.
   * @param  y the Y axis coord.
   * @param  x the X axis coord.
   */
  movePlayer(player, y, x) {
    const currentCell = document.getElementById(
      this.obtainCellId(player.position.y, player.position.x)
    );
    const newCell = document.getElementById(this.obtainCellId(y, x));

    // Move in the grid.
    this.grid[player.position.y][player.position.x] = 1;
    this.grid[y][x] = player.name;
    // Make the change in the map.
    currentCell.innerHTML = 1;
    
    currentCell.classList.remove(player.team);

    newCell.classList.add(getMyTeamClass(player));

    
    newCell.classList.remove("movAvailable");
    newCell.innerHTML = player.name;

    // Changing status interface events.
    currentCell.onmousemove = null;
    currentCell.onmouseout = null;

    newCell.onmousemove = function() {
      showPlayerDetails(player);
    };
    newCell.onmouseout = function() {
      hidePlayerDetails();
    };
  }

  /**
   * Checks if the tile is an alive player
   * @param tile 
   * @returns boolean
   */
  checkTileIsPlayer(tile) {
    if (
      tile.innerHTML != "0" &&
      tile.innerHTML != "1" &&
      tile.innerHTML != "2" &&
      tile.innerHTML != "5" &&
      tile.innerHTML != "6"
    ) {
      return true;
    } else {
      return false;
    }
  }
}

class Player {
  constructor(id, name, team, clan, level, health, currentHealth, motto, y, x) {
    this.id = id;
    this.name = name;
    this.team = team;
    this.clan = clan;
    this.level = level;
    this.health = health;
    this.currentHealth = currentHealth;
    this.percentageOfHealth = 100;
    this.motto = motto;
    this.position = new Position(y, x);
    this.hpColor = "limegreen";
    this.defending = false;
  }
  /**
   * Sets the health points bar color based on the percentage.
   */
  changeHpBarColor() {
    if (this.percentageOfHealth === 100) {
      this.hpColor = "#32CD32";
    } else if (this.percentageOfHealth > 90) {
      this.hpColor = "#4ED12E";
    } else if (this.percentageOfHealth > 80) {
      this.hpColor = "#6FD729";
    } else if (this.percentageOfHealth > 70) {
      this.hpColor = "#93DC25";
    } else if (this.percentageOfHealth > 60) {
      this.hpColor = "#BAE120";
    } else if (this.percentageOfHealth > 50) {
      this.hpColor = "#E5E51C";
    } else if (this.percentageOfHealth > 40) {
      this.hpColor = "#EBC016";
    } else if (this.percentageOfHealth > 30) {
      this.hpColor = "#F09711";
    } else if (this.percentageOfHealth > 20) {
      this.hpColor = "#F5690B";
    } else if (this.percentageOfHealth > 10) {
      this.hpColor = "#F93606";
    } else if (this.percentageOfHealth >= 0) {
      this.hpColor = "#FF0000";
    }
  }
  /**
   * Calculates and sets the value for percentageOfHealth.
   */
  calcPercentageOfHealth() {
    this.percentageOfHealth =
      (Number(this.currentHealth) / Number(this.health)) * 100;
  }
  /**
   * Moves the player to a new position.
   * @param  y  the y coord on the grid.
   * @param  x  the x coord on the grid.
   */
  movePlayer(y, x) {
    y = parseInt(y);
    x = parseInt(x);
    map.movePlayer(this, y, x);
    this.position = new Position(y, x);
  }
  /**
   * Searches and prints in the map the available movements.
   * @param  num the available number of steps.
   */
  // I SHOULD UPGRADE THIS METHOD FOR A BETTER PERFORMANCE.
  movementAvailable(num) {
    const grid = map.grid;
    grid[this.position.y][this.position.x] = 5;
    const movesToBeCalc = [[this.position]];
    const initialNum = num;
    while (num > 0 && movesToBeCalc[initialNum - num].length) {
      movesToBeCalc[initialNum - num].forEach(position => {
        let movesAround = position.checkWalkingAround(grid);
        if (!movesToBeCalc[initialNum - num + 1])
          movesToBeCalc[initialNum - num + 1] = [];
        movesToBeCalc[initialNum - num + 1] = movesToBeCalc[
          initialNum - num + 1
        ].concat(movesAround);
        movesAround.forEach(position => (grid[position.y][position.x] = 5));
      });
      num--;
    }
    grid[this.position.y][this.position.x] = this.name;
    map.showCurrentGrid();
  }
  /**
   * Searches in the map the available near enemies
   * @param  attackingPlayer the player who is executing the attack.
   */
  rangeAttack(attackingPlayer) {
    const grid = map.grid;
    const tilesAround = attackingPlayer.position.checkEnemyAround(
      grid,
      attackingPlayer
    );
    return tilesAround;
  }

  /**
   * Substracts the value of the hit to the currentHealth and
   * in case of the currentHealth is less than 0, sets to 0 value.
   * @param  hit the number of the damage of the hit.
   */
  receiveAttack(hit) {
    if(!this.defending)
      this.currentHealth = this.currentHealth - hit > 0 ? this.currentHealth - hit : 0;
    else
      this.currentHealth = this.currentHealth - (hit/2) > 0 ? this.currentHealth - (hit/2): 0;
  }
  /**
   * Allows to see each player the corresponding current health point bar for each player.
   */
  currentHpHud() {
    document.querySelector(".current-hp").style.transition = "none";
    void document.querySelector(".current-hp").offsetWidth;
    document.querySelector(".current-hp").style.width =
      this.percentageOfHealth + "%";
    document.querySelector(".current-hp").style.backgroundColor = this.hpColor;
    document.querySelector(".current-hp").style.transition = "1s";
  }
  setPlayerDefending(){
    this.defending = true;
  }

  unsetPlayerDefending(){
    this.defending = false;
  }
}

class Position {
  constructor(y, x) {
    this.y = y;
    this.x = x;
  }
  /**
   * Checks the tiles around from the current positions are
   * playable tiles that can be walked on them.
   * @param  reja the two array of tiles from the map (grid).
   * @return array of new positions available to walk.
   */
  checkWalkingAround(reja) {
    let pos = [];
    let newPosition;

    // Check left
    newPosition = new Position(this.y, this.x - 1);
    if (this.x > 0 && reja[newPosition.y][newPosition.x] == 1)
      pos.push(newPosition);
    // Check right
    newPosition = new Position(this.y, this.x + 1);
    if (this.x < 6 && reja[newPosition.y][newPosition.x] == 1)
      pos.push(newPosition);
    // Check bottom
    newPosition = new Position(this.y + 1, this.x);
    if (this.y < 6 && reja[newPosition.y][newPosition.x] == 1)
      pos.push(newPosition);
    // Check top
    newPosition = new Position(this.y - 1, this.x);
    if (this.y > 0 && reja[newPosition.y][newPosition.x] == 1)
      pos.push(newPosition);

    return pos;
  }
  /**
   * Checks the tiles around from the current player position
   * are enemies.
   * @param  grid the two array of tiles from the map (grid).
   * @return array of sorrounding enemies.
   */
  checkEnemyAround(grid, playerAttackingName) {
    let pos = [];
    let newPosition;

    const rivalTeam = oppositeTeam(playerAttackingName.team);
    const enemies = getArrayEnemiesRivalTeam(rivalTeam);

    for (let i = 0; i < enemies.length; i++) {
      // Check left
      newPosition = new Position(this.y, this.x - 1);
      if (this.x > 0 && grid[newPosition.y][newPosition.x] == enemies[i].name)
        pos.push(newPosition);
      // Check right
      newPosition = new Position(this.y, this.x + 1);
      if (this.x < 6 && grid[newPosition.y][newPosition.x] == enemies[i].name)
        pos.push(newPosition);
      // Check bottom
      newPosition = new Position(this.y + 1, this.x);
      if (this.y < 6 && grid[newPosition.y][newPosition.x] == enemies[i].name)
        pos.push(newPosition);
      // Check top
      newPosition = new Position(this.y - 1, this.x);
      if (this.y > 0 && grid[newPosition.y][newPosition.x] == enemies[i].name)
        pos.push(newPosition);
    }

    return pos || 0;
  }
}

class History {
  constructor(orderedPlayers) {
    this.history = [];
    this.orderTurn = orderedPlayers;
    this.currentTurn;
  }
  /**
   * THIS WILL BE EDITED AS SOON AS POSSIBLE.
   */
  nextTurn() {
    let idTurn = this.history.length + 1;

    let currentPlayer = this.orderTurn[
      this.history.length % this.orderTurn.length
    ];
    let turn = new Turn(idTurn, currentPlayer, 1);

    document.getElementById(map.obtainCellId(currentPlayer.position.y, currentPlayer.position.x)).classList.add("current-player");

    turn.setDicePower();
    this.currentTurn = turn;
    turn.initializeTime(this.orderTurn.length);

    this.history.push(turn);
  }
  getCurrentTurn() {
    return this.currentTurn;
  }
  getTurnOrderId(i) {
    return this.orderTurn[i].id;
  }
  getAllTurnOrderId() {
    var playerIdArray = [];
    for (let i = 0; i < this.orderTurn.length; i++)
      playerIdArray.push(this.orderTurn[i].id);
    return playerIdArray;
  }
}
/**
 *  FALTA COMENTAR ESTA CLASE Y SUS METODOS. (NO FINALIZADA)
 */
class Turn {
  constructor(id, player, action) {
    this.id = id;
    this.player = player;
    this.action;
    this.command;
    this.dicePower;
    this.timeTurn;
  }
  setDicePower() {
    this.dicePower = Math.floor(Math.random() * 6 + 1);
  }
  getDicePower() {
    return this.dicePower;
  }
  initializeTime(orderTurn) {
    if (timer == undefined) timer = setInterval(timeTurn, 1000);
    // Si es el ultimo turno incrementamos round
    if (turn == orderTurn) {
      turn = 0;
      round++;
    }
    showStatus();
  }
  
}
/********************
 * GLOBAL VARIABLES *
 ********************/
window.onload = startGame;

var users = []; // Array of Objects (Player).

// ! Esta variable crear la funcionalidad de 2 acciones por turno.
var action = 0;
// ! Estas dos variables de abajo refactorizar su codigo.
var turn = 0;
var round = 0;

var team = ["Uchiha", "Touhou"]; // Name of the teams.
var seconds; // Duration of the turn.
var gamePaused = false; // Pause status
var timer = undefined; // Countdown of time.
var surrender; // Timer of surrending.
var map; // Contains the map object.
var story; // Contains the turn history.

const GAME_NAME = "Batallas JavaScript";
const IMG_PATH = "./img/";

function startGame() {
  // Game events.
  document.getElementById("game_pause").onclick = pausa;
  document.getElementById("game_surrender").onmousedown = surrenderStart;
  document.getElementById("game_surrender").onmouseup = surrenderCancel;
  document.getElementById("game_options").onmouseover = configHover;
  document.getElementById("game_options").onmouseout = configOut;
  document.getElementById("no_pause").onclick = pausa;
  // Game commands.
  document.getElementById("walk").onclick = walkCommand;
  document.getElementById("attack").onclick = attackCommand;
  document.getElementById("defend").onclick = defCommand;
  document.getElementById("next").onclick = passCommand;
  /************************************************
   * Manually generation of the game data         *
   ************************************************/
  map = new Board(1, "Pelea Legendaria");

  users[0] = new Player(1, "Sasuke", team[0], "1", 1, 15, 15, "pika", 0, 6);
  users[2] = new Player(2, "Madara", team[0], "2", 1, 15, 15, "¿euro?", 0, 3);
  users[4] = new Player(3, "Itachi", team[0], "3", 1, 15, 15, "adulto", 0, 0);
  users[1] = new Player(4, "Reimu", team[1], "4", 1, 15, 15, "DJ", 6, 6);
  users[3] = new Player(5, "Remilia", team[1], "5", 1, 15, 15, "¿lumis?", 6, 3);
  users[5] = new Player(6, "Youmu", team[1], "4", 1, 15, 15, "alma", 6, 0);
  // Sets the properly alternation for turns.
  orderOfPlayers = [users[0], users[1], users[2], users[3], users[4], users[5]];
  // Creates the turn history.
  story = new History(orderOfPlayers);
  // Inserts all players in the map
  for (var i = 0; i < users.length; i++) map.insertPlayer(users[i]);
  // Painting initial map.
  map.showCurrentGrid();
  // Show the HUD data.
  showGameData();
  // Start of turn and timers.
  story.nextTurn();
}
/************
 * COMMANDS *
 ************/
function walkCommand() {
  map.restoreMap();
  users[turn % users.length].movementAvailable(
    story.getCurrentTurn().getDicePower()
  );
  addWalkEvent();
}

function attackCommand() {
  removeWalkEvent();
  map.restoreMap();
  const attacker = users[turn % users.length];
  // Get available enemies around.
  const tilesAround = attacker.rangeAttack(attacker);
  // Each enemy tile ready for receiving attack
  tilesAround.forEach(function(tile) {
    // set all tiles as failed attack

    enemyAvailable = document.getElementById(tile.y + "-" + tile.x);
    enemyAvailable.classList.add("attackAvailable");
    // Add the event to check target
    addAttackEvent();
    // Receiving attack
    enemyAvailable.onclick = function() {
      playerAttacked = map.getPlayerByName(this.innerHTML);

      blockPlayerDetails();
      playerAttacked.receiveAttack(story.getCurrentTurn().getDicePower()); // STORY GLOBAL
      // Remove class to the attacked player and other possible enemy around.
      this.classList.remove("attackAvailable");
      enemyAvailable.classList.remove("attackAvailable");
      // Remove the event to the attacked player and other possible enemy around.
      removeAttackEvent();
      // Keep the HUD active until end of damage animation.
      playerAttacked.calcPercentageOfHealth();
      showPlayerDetails(playerAttacked);
      setTimeout(unblockPlayerDetails, 1000);
      playerAttacked.unsetPlayerDefending();
      passCommand();
    };
  });
}
function defCommand() {
  map.restoreMap();
  users[turn % users.length].setPlayerDefending();
  passCommand();
}

function passCommand() {
  turn++;
  map.restoreMap();
  restoreTime();
  removeAttackEvent();
  if (timer == undefined) timer = setInterval(timeTurn, 1000);
}
/**************
 *  UTILITIES *
 **************/
function getMyTeamClass(pj){
  return pj.team == team[0]? "teamOne":"teamTwo";
}
function oppositeTeam(myTeam) {
  return myTeam == team[0] ? team[1] : team[0];
}
function getTeamFromTile(tile) {
  return tile.classList.contains("teamOne") ? team[0] : team[1];
}
function getArrayEnemiesRivalTeam(team) {
  var playersEnemyTeam = [];
  users.forEach(function(pj) {
    if (pj.team == team) playersEnemyTeam.push(pj);
  });
  return playersEnemyTeam;
}

/**************************************
 *       COMMAND RELATED FUNCTIONS    *
 **************************************/
function addWalkEvent() {
  Array.from(document.getElementsByClassName("tile")).forEach(cell =>
    cell.addEventListener("click", move)
  );
}
function removeWalkEvent() {
  Array.from(document.getElementsByClassName("tile")).forEach(cell =>
    cell.removeEventListener("click", move)
  );
}
function addAttackEvent() {
  Array.from(document.getElementsByClassName("tile")).forEach(cell =>
    cell.addEventListener("click", attack)
  );
}
function removeAttackEvent() {
  Array.from(document.getElementsByClassName("tile")).forEach(cell =>
    cell.removeEventListener("click", attack)
  );
}
function move() {
  var y = map.transformIdToCoordY(this.id);
  var x = map.transformIdToCoordX(this.id);
  var cellId = this.id;
  // Valid movement.
  if (document.getElementById(cellId).innerHTML == 5) {
    users[turn % users.length].movePlayer(y, x);
    turn++;
    restoreTime();
  } else {
    console.log("Invalid movement");
  }
  removeWalkEvent();
  map.restoreMap();
}

function attack() {
  let attacked = map.getPlayerByName(this.innerHTML);
  let attacker = map.getPlayerByName(users[turn % users.length].name);
  if (map.checkTileIsPlayer(this)) {
    if (attacked.team !== attacker.team) {
      if (this.classList.contains("attackAvailable") === true) {
        console.log("Valid attack");
      } else {
        console.log("Not available enemy");
        map.restoreMap();
      }
    } else {
      if (attacked === attacker) {
        console.log("You cannot attack yourself");
      } else {
        console.log("Your teammate");
      }
      map.restoreMap();
    }
  } else {
    console.log("Invalid attack");
    map.restoreMap();
  }
  removeAttackEvent();
}

/*******************
 * TIME FUNCTIONS  *
 *******************/
function timeTurn() {
  // Turn starting.
  if (seconds == undefined) {
    seconds = new Date(2000).getTime() / 100;
    seconds = parseInt(seconds);
    document.getElementById("current-time").style.transition = "0.5s";
    // Timer bar animation
    document
      .getElementById("current-time")
      .classList.remove("animation-time-bar");
    void document.getElementById("current-time").offsetWidth; // Reset cheat.
    document.getElementById("current-time").classList.add("animation-time-bar");
  }
  // Turn time expire
  if (seconds < 0) {
    clearInterval(timer);
    timer = undefined;
    seconds = undefined;
    turn++;
    // Delete all events
    removeWalkEvent();
    removeAttackEvent();

    map.restoreMap();

    story.nextTurn();
  }

  // Each second of the countdown
  if (seconds != undefined) {
    document.getElementById("time-turn").innerHTML = seconds;
    document.getElementById("current-time").style.width = seconds / 2 + "vw";
    seconds--;
  }
}

function restoreTime() {
  clearInterval(timer);
  timer = undefined;
  document.getElementById("current-time").style.width = "10vw";
  seconds = undefined;
  story.nextTurn();
  timeTurn();
}
/*******************************
 *      GAME INFO DISPLAY      *
 *******************************/
function showStatus() {
  document.querySelector(".name-player").textContent =
    users[turn % users.length].name;
  // FALTA FUNCIONALIDAD DE ACCION Y PINTARLA
  document.querySelector("#dice_power").innerHTML = story.getCurrentTurn().dicePower;
  const players = document.querySelectorAll(".player");
  players.forEach(function(player, index) {
    player.innerHTML = story.getTurnOrderId(index);
    if (player.classList.contains("player-turn"))
      player.classList.remove("player-turn");
  });
  document
    .querySelectorAll(".player")
    [turn % users.length].classList.add("player-turn");
}

function showGameData() {
  document.querySelector("#game_name").innerHTML = map.mapName;
  document.querySelector("#title").innerHTML = GAME_NAME;
  document.querySelector("#game_id").innerHTML = map.id;
}
function blockPlayerDetails() {
  document.querySelectorAll(".tile").forEach(function(tile) {
    if (
      tile.innerHTML != 0 &&
      tile.innerHTML != 1 &&
      tile.innerHTML != 2 &&
      tile.innerHTML != 5 &&
      tile.innerHTML != 6
    ) {
      tile.onmousemove = function() {};
      tile.onmouseout = function() {};
    }
  });
}
function unblockPlayerDetails() {
  document.querySelectorAll(".tile").forEach(function(tile) {
    if (
      tile.innerHTML != 0 &&
      tile.innerHTML != 1 &&
      tile.innerHTML != 2 &&
      tile.innerHTML != 5 &&
      tile.innerHTML != 6
    ) {
      for (let i = 0; i < map.players.length; i++) {
        let currentCheckPlayer = map.players[i];
        if (tile.innerHTML === currentCheckPlayer.name) {
          tile.onmousemove = function() {
            showPlayerDetails(currentCheckPlayer);
          };
          tile.onmouseout = function() {
            hidePlayerDetails();
          };
        }
      }
    }
  });
}

function showPlayerDetails(pj) {
  document.getElementsByClassName("player-status")[0].style.display = "block";
  document.getElementsByClassName("id-player")[0].innerHTML = pj.id;
  document.getElementById("name-player").innerHTML = pj.name;

  document.getElementsByClassName("player-hp-bar")[0].style.display = "block";
  document.getElementById("current-hp").innerHTML = pj.currentHealth;

  pj.changeHpBarColor();
  pj.currentHpHud();

  document.getElementById("max-hp").innerHTML = pj.health;
  document.getElementsByClassName("player-data")[0].style.display = "block";
  document.getElementById("player-level-value").innerHTML = pj.level;
  document.getElementById("player-clan-value").innerHTML = pj.clan;
  document.getElementById("player-motto-value").innerHTML = pj.motto;

  document.getElementById("player-image").src =
    IMG_PATH + "/players/" + pj.id + ".png";
  document.getElementById("player-image").alt = pj.id + "_avatar";
}

function hidePlayerDetails() {
  document.getElementsByClassName("player-status")[0].style.display = "none";
  document.getElementsByClassName("player-hp-bar")[0].style.display = "none";
  document.getElementsByClassName("player-data")[0].style.display = "none";
}

function pausa() {
  if (gamePaused) {
    document.getElementById("game_pause").children[0].classList.add("fa-pause");
    document
      .getElementById("game_pause")
      .children[0].classList.remove("fa-play");
    gamePaused = false;
    if (timer == undefined) timer = setInterval(timeTurn, 1000);
    document.getElementById("current-time").style.webkitAnimationPlayState =
      "running";
    document.getElementById("game_paused").style.display = "none";
  } else {
    document
      .getElementById("game_pause")
      .children[0].classList.remove("fa-pause");
    document.getElementById("game_pause").children[0].classList.add("fa-play");
    gamePaused = true;
    clearInterval(timer);
    timer = undefined;
    document.getElementById("current-time").style.webkitAnimationPlayState =
      "paused";
    document.getElementById("game_paused").style.display = "block";
  }
}

function surrenderStart(event) {
  const elemento = event.currentTarget.children[0];
  if (surrender === undefined)
    surrender = setInterval(function() {
      elemento.classList.add("rendir");
      setTimeout(function() {
        elemento.classList.remove("rendir");
      }, 250);
    }, 400);
}

function surrenderCancel() {
  clearInterval(surrender);
  surrender = undefined;
}

function configHover() {
  this.children[0].classList.add("fa-spin");
}

function configOut() {
  this.children[0].classList.remove("fa-spin");
}
