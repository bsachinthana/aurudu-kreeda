export class Square {
    private color = 'red';
    private widthHalf;
    private x = 0;
    private y = 0;
    private z = 30;

    constructor(private ctx: CanvasRenderingContext2D) {
      this.x = ((this.x + this.ctx.canvas.width) / 2) - (this.z / 2);
      this.widthHalf = this.x;
      this.y = ((this.y + this.ctx.canvas.height) / 2) - (this.z / 2);
      this.draw();
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
      this.ctx.fillRect(this.x, this.y, this.z, this.z);
    }

    moveTo(centerOriginatedPos) {
      console.log(centerOriginatedPos);
      this.x = this.widthHalf + centerOriginatedPos;
      this.draw();
    }
  }
