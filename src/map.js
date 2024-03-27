import {Tile} from './tile.js'
export class Map {
    tileW = 16;
    tileH = 16;
    ctx;
    floor = [
        
        [154, 155, 155, 155, 155, 155, 155, 155, 155, 156],
        [176, 177, 177, 177,177, 177, 177, 177, 177, 178],
        [176, 177, 177, 177,177, 177, 177, 177, 177, 178],
        [176, 177, 177, 177,177, 177, 177, 177, 177, 178],
        [176, 177, 177, 177,177, 177, 177, 177, 177, 178],
        [176, 177, 177, 177,177, 177, 177, 177, 177, 178],
        [176, 177, 177, 177,177, 177, 177, 177, 177, 178],
        [176, 177, 177, 177,177, 177, 177, 177, 177, 178],
        [176, 177, 177, 177,177, 177, 177, 177, 177, 178],
        [198, 199, 199, 199, 199, 199, 199, 199, 199, 200]
    ];
    building = [
        [-1,-1,-1,-1,-1,-1,11,12,13],
        [-1,-1,-1,-1,-1,-1,31,32,33],
        [-1,-1,-1,-1,-1,-1,51,52,53],
        [-1,121,122,-1],
        [140,141,142,143],
        [160, 161, 162, 163, 1, 2, 3],
        [-1, -1, -1,20,21,22,23],
        [-1, -1, -1,40,41,42,43],
        [],
        []
    ];

    tiles = [];//guardamos las instancias de la clase tile
    tileSheet;//el recurso de la imagen de los azulejos
    tileSheetBuilding;
    tileMapFloor = {}; // Objeto para mapear los azulejos en la hoja de azulejos
    tileMapBuilding={};
    mapTilesCollider=[];
    constructor(ctx) {
        this.ctx = ctx;
    }

    load(callback) {//tile sheet floor
        this.tileSheet = new Image();
        this.tileSheetBuilding=new Image();
        this.tileSheet.onload = () => {
           
            this.createTileMap(this.tileMapFloor,this.tileW, this.tileH, Math.floor(this.tileSheet.width/this.tileW),Math.floor(this.tileSheet.height/this.tileH));//esto puede ser dinamico dividiendo el ancho/tile alto/tile
            this.createTiles(this.tileSheet,this.floor,this.tileMapFloor);//tilesheet,matriz,tilemap
            
        };
        this.tileSheetBuilding.onload = () => {
            this.createTileMap(this.tileMapBuilding,this.tileW, this.tileH, Math.floor(this.tileSheetBuilding.width/this.tileW), Math.floor(this.tileSheetBuilding.height/this.tileH));
            this.createTiles(this.tileSheetBuilding,this.building,this.tileMapBuilding);//tilesheet,matriz,tilemap
            //cuando cargue todo le pasamos el mapa de collider
            
            callback(this.mapTilesCollider);
        }
        this.tileSheet.src = "../public/TilesetFloor.png";
        this.tileSheetBuilding.src = "../public/TilesetBuilding.png";
       
    }
//creamos los recortes de cada azulejo en el mapa de suelo y lo guardamos en el array tileMap
    createTileMap(tileMap,tileWidth, tileHeight, tilesPerRow, totalRows) {
        let tileIndex = 0; // Variable para asignar un índice único a cada azulejo
        for (let row = 0; row < totalRows; row++) {
            for (let col = 0; col < tilesPerRow; col++) {
                // Calcular las coordenadas de recorte para cada azulejo
                const tileX = col * tileWidth;
                const tileY = row * tileHeight;
                tileMap[tileIndex] = {
                    x: tileX,
                    y: tileY
                };
                tileIndex++; // Incrementar el índice del azulejo
            }
        }
    }
    
//creamos las instancias de la clase tile para cada azulejo en el mapa de suelo y lo guardamos en el array tiles
    createTiles(tileSheet,capa,tileMap) {
        for (let i = 0; i < capa.length; i++) {
            for (let j = 0; j < capa[i].length; j++) {
                const tileX = j * this.tileW;
                const tileY = i * this.tileH;
                const tileValue = capa[i][j];
                const tileInfo = tileMap[tileValue];
                if (tileValue !== -1) {
                    const tileInfo = tileMap[tileValue];
                    let collider=false;

                    if(tileSheet.src.split('/').slice(-1).join("") !== "TilesetFloor.png"){
                        collider=true;
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
                    if(tile.collider==true){
                        this.mapTilesCollider.push(tile);
                    }else{
                        this.tiles.push(tile);
                    }
                    
                }
            }
        }
    }
    //calcula el movimiento por separado en funcion de si es colisionable o no
    //ojo puede crear desfasajes a futuro
    update(direccion,speed) {
        if(direccion ==0){
            this.tiles.forEach(tile => {
                tile.x+=0
                tile.x+=0
            });
            this.mapTilesCollider.forEach(tile => {
                tile.x+=0
                tile.x+=0
            })
        }
        else if(direccion == 1){
            this.tiles.forEach(tile => {
                tile.x-=speed
            });
            this.mapTilesCollider.forEach(tile => {
                tile.x-=speed
            });
        }
        else if(direccion == 2){
            this.tiles.forEach(tile => {
                tile.y-=speed
            });
            this.mapTilesCollider.forEach(tile => {
                tile.y-=speed
            });
        }
        else if(direccion == 3){
            this.tiles.forEach(tile => {
                tile.x+=speed
            });
            this.mapTilesCollider.forEach(tile => {
                tile.x+=speed
            });
        }
        else if(direccion == 4){
            this.tiles.forEach(tile => {
                tile.y+=speed
            });
            this.mapTilesCollider.forEach(tile => {
                tile.y+=speed
            });
        }
    }
    draw() {
        // Dibujar los azulejos en el lienzo
        this.tiles.forEach(tile => {
            tile.draw(this.ctx);
        });
        this.mapTilesCollider.forEach(tile => {
            tile.draw(this.ctx);
        })
        
    }
    getTileMapBuilding(){
        return this.tileMapBuilding;
    }
}
