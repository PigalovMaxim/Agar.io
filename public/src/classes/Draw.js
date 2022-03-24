import { config } from "../config.js";

export default class Draw {
  constructor(options) {
    this.canv = options.canv;
    this.ctx = options.ctx;
    this.backgroundColor = "#ededed";
    this.linesColor = "#d9d9d9";
    this.textColor = "#858585";
    this.lineGap = 30;
  }
  drawField() {
    this._clearField();
    this._drawLines();
    this._drawFood();
    this._drawBorder();
    this._drawText(`Score: ${config.score}`, 20, config.camera.height - 20, false);
    this._drawPlayers();
  }
  _drawText(text, x, y, alignCenter = true, font = 24) {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.textColor;
    if(alignCenter) {
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
    } else {
      this.ctx.textAlign = 'left';
      this.ctx.textBaseline = 'bottom';
    }
    this.ctx.font = `${font}px serif`;
    this.ctx.fillText(text, x, y);
    this.ctx.closePath();
  }
  _drawBorder() {
    this.ctx.beginPath();
    this.ctx.lineWidth = "6";
    this.ctx.strokeStyle = "red";
    this.ctx.rect(
      -config.startPoint.x +
        config.camera.width / 2 +
        (config.startPoint.x - config.player.x),
      -config.startPoint.y +
        config.camera.height / 2 +
        (config.startPoint.y - config.player.y),
      config.WINDOW.WIDTH,
      config.WINDOW.HEIGHT
    );
    this.ctx.stroke();
    this.ctx.closePath();
  }
  _clearField() {
    this.ctx.beginPath();
    this.ctx.rect(0, 0, config.camera.width, config.camera.height);
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fill();
    this.ctx.closePath();
  }
  _drawFood() {
    config.food.forEach((dot) => {
      this._drawCircle(
        config.camera.width / 2 + (dot.x - config.player.x),
        config.camera.height / 2 + (dot.y - config.player.y),
        5,
        dot.color
      );
    });
  }
  _drawCircle(x, y, radius, color = "#ff0000") {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.closePath();
  }
  _drawPlayers() {
    // Enemies
    config.enemies.forEach((enemy) => {
      this._drawCircle(
        config.camera.width / 2 + (enemy.x - config.player.x),
        config.camera.height / 2 + (enemy.y - config.player.y),
        enemy.radius,
        enemy.color
      );
    });
    // You
    this._drawCircle(
      config.camera.width / 2,
      config.camera.height / 2,
      config.player.radius,
      config.player.color
    );
    // Enemies nicks
    config.enemies.forEach((enemy) => {
      this._drawText(
        enemy.nick,
        config.camera.width / 2 + (enemy.x - config.player.x),
        config.camera.height / 2 + (enemy.y - config.player.y)
      );
    });
    // Your nick
    this._drawText(
      config.player.nick,
      config.camera.width / 2,
      config.camera.height / 2
    );
  }
  _drawLines() {
    //Vertical Lines
    for (
      let i = -Math.round(config.WINDOW.HEIGHT / this.lineGap);
      i < Math.round(config.WINDOW.HEIGHT / this.lineGap) * 2;
      i++
    ) {
      const x = i * this.lineGap;
      this._drawLine(
        x + config.startPoint.x - config.player.x,
        x + config.startPoint.x - config.player.x,
        0,
        config.camera.height
      );
    }
    //Horizontal Lines
    for (
      let i = -Math.round(config.WINDOW.WIDTH / this.lineGap);
      i < Math.round(config.WINDOW.WIDTH / this.lineGap) * 2;
      i++
    ) {
      const y = i * this.lineGap;
      this._drawLine(
        0,
        config.camera.width,
        y - config.startPoint.y + config.player.y,
        y - config.startPoint.y + config.player.y
      );
    }
  }
  _drawLine(x1, x2, y1, y2, color = this.linesColor, width = 2) {
    this.ctx.beginPath();
    this.ctx.lineWidth = width;
    this.ctx.strokeStyle = color;
    this.ctx.moveTo(x1, config.camera.height - y1);
    this.ctx.lineTo(x2, config.camera.height - y2);
    this.ctx.stroke();
    this.ctx.closePath();
  }
}
