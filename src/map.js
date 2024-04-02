import { Tile } from "./tile.js";
import { Player } from "./player.js";
import { Enemy } from "./enemy.js";
export class Map {
  player;
  tileW = 16;
  tileH = 16;
  ctx;
  floor = [
    [154, 155, 155, 155, 155, 155, 155, 155, 155, 156],
    [176, 177, 177, 177, 177, 177, 177, 177, 177, 178],
    [176, 177, 177, 177, 177, 177, 177, 177, 177, 178],
    [176, 177, 177, 177, 177, 177, 177, 177, 177, 178],
    [176, 177, 177, 177, 177, 177, 177, 177, 177, 178],
    [176, 177, 177, 177, 177, 177, 177, 177, 177, 178],
    [176, 177, 177, 177, 177, 177, 177, 177, 177, 178],
    [176, 177, 177, 177, 177, 177, 177, 177, 177, 178],
    [176, 177, 177, 177, 177, 177, 177, 177, 177, 178],
    [198, 199, 199, 199, 199, 199, 199, 199, 199, 200],
  ];
  building = [
    [-1, -1, -1, -1, -1, -1, 11, 12, 13],
    [-1, -1, -1, -1, -1, -1, 31, 32, 33],
    [-1, -1, -1, -1, -1, -1, 51, 52, 53],
    [-1, 121, 122, -1],
    [140, 141, 142, 143],
    [160, 161, 162],
    [],
    [],
    [],
    [],
  ];

  tiles = []; //guardamos las instancias de la clase tile
  tileSheet; //el recurso de la imagen de los azulejos
  tileSheetBuilding;
  tileMapFloor = {}; // Objeto para mapear los azulejos en la hoja de azulejos
  tileMapBuilding = {};
  mapTilesCollider = [];
  keysPressed = {};
  speed = 1;

  constructor(ctx) {
    this.ctx = ctx;
    this.tileSheet = new Image();
    this.tileSheetBuilding = new Image();
    this.tileSheet.onload = () => {
      this.createTileMap(
        this.tileMapFloor,
        this.tileW,
        this.tileH,
        Math.floor(this.tileSheet.width / this.tileW),
        Math.floor(this.tileSheet.height / this.tileH)
      ); //esto puede ser dinamico dividiendo el ancho/tile alto/tile
      this.createTiles(this.tileSheet, this.floor, this.tileMapFloor); //tilesheet,matriz,tilemap
    };
    this.tileSheetBuilding.onload = () => {
      this.createTileMap(
        this.tileMapBuilding,
        this.tileW,
        this.tileH,
        Math.floor(this.tileSheetBuilding.width / this.tileW),
        Math.floor(this.tileSheetBuilding.height / this.tileH)
      );
      this.createTiles(
        this.tileSheetBuilding,
        this.building,
        this.tileMapBuilding
      ); //tilesheet,matriz,tilemap
    };
    this.tileSheet.src = "../public/TilesetFloor.png";
    this.tileSheetBuilding.src = "../public/TilesetBuilding.png";

    this.player = new Player(this.ctx);
    this.enemy = new Enemy(this.ctx);
    document.addEventListener("keydown", (e) => this.keyDownHandler(e));
    document.addEventListener("keyup", (e) => this.keyUpHandler(e));
  }

  //creamos los recortes de cada azulejo en el mapa de suelo y lo guardamos en el array tileMap
  createTileMap(tileMap, tileWidth, tileHeight, tilesPerRow, totalRows) {
    let tileIndex = 0; // Variable para asignar un índice único a cada azulejo
    for (let row = 0; row < totalRows; row++) {
      for (let col = 0; col < tilesPerRow; col++) {
        // Calcular las coordenadas de recorte para cada azulejo
        const tileX = col * tileWidth;
        const tileY = row * tileHeight;
        tileMap[tileIndex] = {
          x: tileX,
          y: tileY,
        };
        tileIndex++; // Incrementar el índice del azulejo
      }
    }
  }

  //creamos las instancias de la clase tile para cada azulejo en el mapa de suelo y lo guardamos en el array tiles
  createTiles(tileSheet, capa, tileMap) {
    for (let i = 0; i < capa.length; i++) {
      for (let j = 0; j < capa[i].length; j++) {
        const tileX = j * this.tileW;
        const tileY = i * this.tileH;
        const tileValue = capa[i][j];
        const tileInfo = tileMap[tileValue];
        if (tileValue !== -1) {
          const tileInfo = tileMap[tileValue];
          let collider = false;

          if (
            tileSheet.src.split("/").slice(-1).join("") !== "TilesetFloor.png"
          ) {
            collider = true;
          }
          const tile = new Tile(
            tileSheet,
            tileX,
            tileY,
            tileInfo.x,
            tileInfo.y,
            this.tileW,
            this.tileH,
            collider
          );
          if (tile.collider == true) {
            this.mapTilesCollider.push(tile);
          } else {
            this.tiles.push(tile);
          }
        }
      }
    }
  }

  //UPDATE

  update() {
    this.move();

    this.draw();
  }
  draw() {
    //limpiamos mapa
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fillStyle = "#ddd";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    // Dibujar los azulejos en el lienzo
    this.tiles.forEach((tile) => {
      tile.draw(this.ctx);
    });
    this.mapTilesCollider.forEach((tile) => {
      tile.draw(this.ctx);
    });
    this.player.draw();
    this.enemy.draw();
  }
  getTileMapBuilding() {
    return this.tileMapBuilding;
  }
  move() {
    if (this.keysPressed[37] && !this.checkCollisions()) {
      this.moveLeft();
    } else if (this.keysPressed[39] && !this.checkCollisions()) {
      this.moveRigth();
    } else if (this.keysPressed[38] && !this.checkCollisions()) {
      this.moveTop();
    } else if (this.keysPressed[40] && !this.checkCollisions()) {
      this.moveDown();
    } 
  }

  checkCollisions() {
    const playerLeft = this.player.x;
    const playerRight = this.player.x + this.player.playerWidth;
    const playerTop = this.player.y;
    const playerBottom = this.player.y + this.player.playerHeight;

    const enemyLeft = this.enemy.x;
    const enemyRight = this.enemy.x + this.enemy.enemyWidth;
    const enemyTop = this.enemy.y;
    const enemyBottom = this.enemy.y + this.enemy.enemyHeight;

    for (const tile of this.mapTilesCollider) {
      if (tile.collider === true) {
        // Calcular las posiciones de los bordes del azulejo
        const tileLeft = tile.x;
        const tileRight = tile.x + tile.width;
        const tileTop = tile.y;
        const tileBottom = tile.y + tile.height;
        this.collided = false;

        // Verificar si hay superposición entre el jugador y el azulejo
        if (
          playerRight >= tileLeft &&
          playerLeft <= tileRight &&
          playerBottom >= tileTop &&
          playerTop <= tileBottom
        ) {
          this.collided = true;
          // Ajustar la posición del jugador para que esté justo al borde del azulejo
          if (this.keysPressed[37]) {
            this.moveRigth();
            this.keysPressed[37] = false;
          }
          if (this.keysPressed[39]) {
            this.moveLeft();
            this.keysPressed[39] = false;
          }
          if (this.keysPressed[38]) {
           this.moveDown();
            this.keysPressed[38] = false;
          }
          if (this.keysPressed[40]) {
            this.moveTop();
            this.keysPressed[40] = false;
          }
          break;//cortamos el bucle cuando encotramos la colision
        }
      }
    } if (
      playerRight >= enemyLeft &&
      playerLeft <= enemyRight &&
      playerBottom >= enemyTop &&
      playerTop <= enemyBottom
    ){
      this.collided=true;
      if (this.keysPressed[37]) {
        this.moveRigth();
        this.keysPressed[37] = false;
      }
      if (this.keysPressed[39]) {
        this.moveLeft();
        this.keysPressed[39] = false;
      }
      if (this.keysPressed[38]) {
       this.moveDown();
        this.keysPressed[38] = false;
      }
      if (this.keysPressed[40]) {
        this.moveTop();
        this.keysPressed[40] = false;
      }
    }

    return this.collided;
  }
  keyDownHandler(e) {
    this.keysPressed[e.keyCode] = true;
  }
  keyUpHandler(e) {
    this.keysPressed[e.keyCode] = false;
  }
  moveLeft() {
    this.tiles.forEach((tile) => {
      tile.x += this.speed;
    });
    this.mapTilesCollider.forEach((tile) => {
      tile.x += this.speed;
    });
    this.enemy.x += this.speed;
  }
  moveRigth() {
    this.tiles.forEach((tile) => {
      tile.x -= this.speed;
    });
    this.mapTilesCollider.forEach((tile) => {
      tile.x -= this.speed;
    });
    this.enemy.x -= this.speed;
  }
  moveTop() {
    this.tiles.forEach((tile) => {
      tile.y += this.speed;
    });
    this.mapTilesCollider.forEach((tile) => {
      tile.y += this.speed;
    });
    this.enemy.y += this.speed;
    // Flecha arriba
  }
  moveDown() {
    this.tiles.forEach((tile) => {
      tile.y -= this.speed;
    });
    this.mapTilesCollider.forEach((tile) => {
      tile.y -= this.speed;
    });
    this.enemy.y -= this.speed;
  }
}
