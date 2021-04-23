export class Square {
    private color = 'red';
    private widthHalf;
    private x = 0;
    private y = 0;
    private z = 30;
    private base_image: HTMLImageElement;
    private fore_image: HTMLImageElement;
    private imageOffset = 0;

    constructor(private ctx: CanvasRenderingContext2D) {
      this.x = 0 //((this.x + this.ctx.canvas.width) / 2) - (this.z / 2);
      this.widthHalf = ((this.x + this.ctx.canvas.width) / 2) - (this.z / 2);//this.x;
      this.y =  0 //((this.y + this.ctx.canvas.height) / 2) - (this.z / 2);

      this.base_image = new Image();
      this.base_image.src = '/assets/game_bg.jpg';
      this.base_image.onload = () => {
        this.imageOffset = (this.ctx.canvas.width-this.base_image.width)/2;
        this.x = this.imageOffset;
        this.draw();
      }

      this.fore_image = new Image();
      this.fore_image.src = '/assets/game_players.png';
      this.fore_image.onload = () => {
        this.draw();
      }
 
    }

    moveRight() {
      this.x += 5;
      this.draw();
    }

    moveLeft() {
        this.x -= 5;
        this.draw();
    }

    private draw() {
      this.ctx.fillStyle = this.color;
      this.ctx.drawImage(this.base_image, 0+this.x, 0, 1291,600);
      this.ctx.drawImage(this.fore_image, 30, 25, 978,550);
     // this.ctx.fillRect(this.x, this.y, this.z, this.z);
    }

    moveTo(centerOriginatedPos) {
      console.log(centerOriginatedPos);
      this.x = centerOriginatedPos+this.imageOffset;
      this.draw();
    }
  }
