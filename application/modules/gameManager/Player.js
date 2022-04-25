class Player {
    constructor(window, generateColor, socketId) {
        //Data from user
        this.nick;
        this.guid;
        //Other data
        this.x;
        this.y;
        this.score;
        this.radius;
        this.color;
        this.speed;
        this.socketId = socketId;
        this.window = window;
        this.generateColor = generateColor;
    }

    init(guid, nick){
        this.guid = guid;
        this.nick = nick;
        this.x = Math.round(Math.random() * this.window.width);
        this.y = Math.round(Math.random() * this.window.height);
        this.score = 0;
        this.radius = 25;
        this.color = this.generateColor();
        this.speed = 3;
    }

    get() {
        return {
            nick: this.nick,
            guid: this.guid,
            x: this.x,
            y: this.y,
            radius: this.radius,
            color: this.color,
            socketId: this.socketId
        }
    }

    getSelf(){
        return {
            nick: this.nick, 
            guid: this.guid,
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