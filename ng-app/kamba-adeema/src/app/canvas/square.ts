export class Square {
    private color = 'red';
    private x = 0;
    private y = 0;
    private z = 30;

    constructor(private ctx: CanvasRenderingContext2D) {
      this.x = ((this.x + this.ctx.canvas.width) / 2) - (this.z / 2);
      this.y = ((this.y + this.ctx.canvas.height) / 2) - (this.z / 2);
      this.draw();
    }

    moveRight() {
      this.x++;
      this.draw();
    }

    moveLeft() {
        this.x--;
        this.draw();
    }

    private draw() {
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(this.x, this.y, this.z, this.z);
    }
  }
