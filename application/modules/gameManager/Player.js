class Player {
    constructor() {
        //Data from user
        this.guid;
        //Other data
        this.x;
        this.y;
        this.score;
        this.radius;
        this.color;
        this.speed;
    }

    _init(){
        this.x = Math.round(Math.random() * this.window.width);
        this.y = Math.round(Math.random() * this.window.height);
        this.score = 0;
        this.radius = 25;
        this.color = this._generateColor();
        this.speed = 3;
    }

    get() {
        return {
            x: this.x,
            y: this.y,
            radius: this.radius,
            color: this.color,
        }
    }

    getSelf(){
        return {
            x: this.x,
            y: this.y,
            score: this.score,
            radius: this.radius,
            color: this.color,
            speed: this.speed
        }
    }
}

module.exports = Player;

/*
guid стабильный
token генерится при логине
hash меняется при каждом запросе 
*/