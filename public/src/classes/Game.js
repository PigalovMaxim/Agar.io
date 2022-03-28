import Draw from "./Draw.js";

import { config } from "../config.js";

export default class Game {
  constructor(options) {
    this.canv = options.canv;
    this.ctx = options.ctx;
    this.socket = options.socket;
    config.startPoint = { x: config.player.x, y: config.player.y };

    config.xRatio = document.documentElement.clientWidth / config.camera.width;
    config.yRatio =
      document.documentElement.clientHeight / config.camera.height;

    this.canv.current.style.width = document.documentElement.clientWidth + "px";
    this.canv.current.style.height =
      document.documentElement.clientHeight + "px";
    this.canv.current.width = config.camera.width;
    this.canv.current.height = config.camera.height;
    this.draw = new Draw({
      canv: this.canv,
      ctx: this.ctx,
    });
    this.socket.on("getScene", (response) => {
      if (!response.status) return;
      config.enemies = response.players.filter( player => player.id !== config.id );
      config.player = response.players.find( player => player.id === config.id );
      config.food = response.food;
      console.log(config.player, config.food, config.enemies);
      this.draw.drawField();
    });
    this.interval = null;
    this.socket.on("death", () => {
      this.stop();
    });
  }

  start() {
    this.interval = setInterval(() => this._update(), 15);
  }

  stop() {
    clearInterval(this.interval);
  }

  _update() {
    if (
      config.player.x !== config.movePoint.x ||
      config.player.y !== config.movePoint.y
    ) {
      this.socket.emit("move", {
        x: config.unitVector.x * config.player.speed,
        y: config.unitVector.y * config.player.speed,
      });
      this._checkFoodEating();
      this._checkKill();
    }
  }

  _checkFoodEating() {
    config.food.forEach((food, index) => {
      const distanceVector = {
        x: food.x - config.player.x,
        y: food.y - config.player.y,
      };
      const distance = Math.sqrt(
        distanceVector.x * distanceVector.x +
          distanceVector.y * distanceVector.y
      );
      if (distance < config.player.radius) {
        this.socket.emit("eatFood", index);
        this._eat(10);
        /* config.camera.width += config.camera.width / 100;
        config.camera.height += config.camera.height / 100;
        this.canv.current.width = config.camera.width;
        this.canv.current.height = config.camera.height; */
      }
    });
  }

  _checkKill() {
    config.enemies.forEach((enemy, index) => {
      const distanceVector = {
        x: enemy.x - config.player.x,
        y: enemy.y - config.player.y,
      };
      const distance = Math.sqrt(
        distanceVector.x * distanceVector.x +
          distanceVector.y * distanceVector.y
      );
      if (
        distance < config.player.radius &&
        enemy.radius * 1.5 < config.player.radius
      ) {
        this.socket.emit("eatPlayer", enemy.id);
        this._eat(enemy.radius);
      }
    });
  }

  _eat(scoreSize) {
    config.score += scoreSize;
    config.player.radius += Math.round(scoreSize / 20);
    config.player.speed -= Math.round(scoreSize / 2000);
  }

  mousemove({ offsetX, offsetY }) {
    if (
      (config.camera.width * config.xRatio) / 2 === offsetX &&
      (config.camera.height * config.yRatio) / 2 === offsetY
    )
      return;
    const x =
      config.player.x + offsetX - (config.camera.width * config.xRatio) / 2;
    const y =
      config.player.y + offsetY - (config.camera.height * config.yRatio) / 2;
    config.movePoint = { x, y };
    const vector = { x: x - config.player.x, y: y - config.player.y };
    const vectorLength = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    if (vectorLength === 0) return;
    config.unitVector = {
      x: vector.x / vectorLength,
      y: vector.y / vectorLength,
    };
  }
}
