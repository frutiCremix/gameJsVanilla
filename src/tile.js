export class Tile {
 
        constructor(image, x, y, tileX, tileY, width, height,collider) {
            this.image = image; // Imagen del tile
            this.x = x; // Posición x del azulejo en el lienzo
            this.y = y; // Posición y del azulejo en el lienzo
            this.tileX = tileX; // Coordenada x de recorte en la hoja de azulejos
            this.tileY = tileY; // Coordenada y de recorte en la hoja de azulejos
            this.width = width; // Ancho del azulejo
            this.height = height; // Alto del azulejo
            this.collider=collider;
        }
    
        draw(ctx) {
            // Dibujar el azulejo en el lienzo
            ctx.drawImage(
                this.image,
                this.tileX,
                this.tileY,
                this.width,
                this.height,
                this.x,
                this.y,
                this.width,
                this.height
            );
            if(this.collider==true){
            ctx.beginPath();
            ctx.strokeRect(this.x,
                this.y,
                this.width,
                this.height);
                ctx.fill();
        }
    }
    
        // Agrega más métodos según sea necesario
    }
