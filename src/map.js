import { Tile } from "./tile.js";
import { Player } from "./player.js";
import { Enemy } from "./enemy.js";
import { CollisionHandler } from "./collisionHandler.js";
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

  enemyActive=[];
  enemyCollider=[];
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
  
    this.crearEnemigos();

    this.collisionHandler= new CollisionHandler(this.player,this.enemyActive,this.mapTilesCollider);
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
    const collidingEnemy = this.collisionHandler.checkPlayerEnemyCollision();
    if(!this.collisionHandler.checkPlayerTileMapCollision() && !collidingEnemy){
      this.move();
     
    }else{
     
      if (this.keysPressed[37]) {
        this.moveRigth();
        this.keysPressed[37]=false;
      } else if (this.keysPressed[39]) {
        this.moveLeft();
        this.keysPressed[39]=false;
      } else if (this.keysPressed[38]) {
        this.moveDown();
        this.keysPressed[38]=false;
      } else if (this.keysPressed[40]) {
        this.moveTop();
        this.keysPressed[40]=false;
      } 
      if(collidingEnemy){
        this.player.setLife(this.player.getLife()-10)

        console.log(this.player.getLife())
      }
     
    }
    

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

    for(let enemy of this.enemyActive){
      enemy.draw();
    }
   
       
    
    
  }
  getTileMapBuilding() {
    return this.tileMapBuilding;
  }
  move() {
    if (this.keysPressed[37]) {
      this.moveLeft();
    } else if (this.keysPressed[39]) {
      this.moveRigth();
    } else if (this.keysPressed[38]) {
      this.moveTop();
    } else if (this.keysPressed[40]) {
      this.moveDown();
    } 
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
    for(let enemy of this.enemyActive){
     enemy.x += this.speed;
    }
   
  }
  moveRigth() {
    this.tiles.forEach((tile) => {
      tile.x -= this.speed;
    });
    this.mapTilesCollider.forEach((tile) => {
      tile.x -= this.speed;
    });
    for(let enemy of this.enemyActive){
    enemy.x -= this.speed;}
  }
  moveTop() {
    this.tiles.forEach((tile) => {
      tile.y += this.speed;
    });
    this.mapTilesCollider.forEach((tile) => {
      tile.y += this.speed;
    });
    for(let enemy of this.enemyActive){
    enemy.y += this.speed;}
    // Flecha arriba
  }
  moveDown() {
    this.tiles.forEach((tile) => {
      tile.y -= this.speed;
    });
    this.mapTilesCollider.forEach((tile) => {
      tile.y -= this.speed;
    });
    for(let enemy of this.enemyActive){
    enemy.y -= this.speed;}
  }
  crearEnemigos() {
    const numEnemies = 2; // Número de enemigos que deseas crear
    const minDistance = 50; // Distancia mínima entre los enemigos

    for (let i = 0; i < numEnemies; i++) {
        let x, y;
        // Generar posiciones aleatorias hasta que se encuentre una que cumpla con los requisitos
        do {
            x = Math.floor(Math.random() * (this.ctx.canvas.width - 50)) + 25; // Posición X aleatoria dentro del canvas
            y = Math.floor(Math.random() * (this.ctx.canvas.height - 50)) + 25; // Posición Y aleatoria dentro del canvas
        } while (this.isTooCloseToOtherEnemies(x, y, minDistance));

        let enemy = new Enemy(this.ctx, x, y);
        this.enemyActive.push(enemy);
    }
}

isTooCloseToOtherEnemies(x, y, minDistance) {
    // Verificar si la nueva posición está demasiado cerca de otros enemigos
    for (let enemy of this.enemyActive) {
        const distanceX = Math.abs(x - enemy.x);
        const distanceY = Math.abs(y - enemy.y);
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        if (distance < minDistance) {
            return true;
        }
    }
    return false;
}
}
