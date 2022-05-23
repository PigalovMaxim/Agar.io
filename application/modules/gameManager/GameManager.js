const BaseModule = require('../BaseModule');
const Player = require('../gameManager/Player');

class GameManager extends BaseModule {
    constructor(options) {
        super(options);
        this.players = [
            {
                guid: '52f50e46-eea7-1c84-7d2b-d6ec1b95c7c1',
                score: 0,
                radius: 25,
                speed: 3,
                x: 0,
                y: 0
            }
        ];
        
        /*this.players = {
            guid: player...
        };*/
        this.window = { width: 3000, height: 3000 };
        this.foods = [];
        this._createFood();

        this.io.on('connection', socket => {
            socket.on(this.SOCKETS.MOVE, data => this.move(data));
            socket.on(this.SOCKETS.JOIN, guid => this.join(guid, socket));
            socket.on(this.SOCKETS.EAT_FOOD, data => this.eatFood(data));
            socket.on(this.SOCKETS.DEATH, guid => this.death(guid, socket));
            socket.on(this.SOCKETS.INCREASE_SIZE, (score, radius, speed, guid) => this.increaseSize(score, radius, speed, guid));
            socket.on(this.SOCKETS.DISCONNECT, () => this.disconnect(socket.id));
        });
        this.mustUpdate = true;
        this.start();
    }

    disconnect(id) {
        this.mediator.get(this.TRIGGERS.DISCONNECT, id);
        this.players.forEach((player, i) => {
            if (player.socketId === id) {
                this.players.splice(i, 1);
                return;
            }
        });
    }

    _createFood() {
        for (let i = 0; i < Math.round(this.window.width / 3); i++) {
            const food = {
                x: Math.round(Math.random() * this.window.width),
                y: Math.round(Math.random() * this.window.height)
            };
            this.foods.push(food);
        }
        this.mustUpdate = true;
    }

    _generateColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    start() {
        setInterval(() => {
            if (this.mustUpdate) {
                this.mustUpdate = false;
                this.io.emit('getScene', this.getScene());
            }
        }, 15);
    }

    eatFood({ index, guid }) {
        const user = this.mediator.get(this.mediator.TRIGGERS.GET_USER_BY_GUID, guid);
        if (!user) return;
        this.foods.splice(index, 1);
        this.mustUpdate = true;
    }

    increaseSize(score, radius, speed, guid) {
        const user = this.mediator.get(this.mediator.TRIGGERS.GET_USER_BY_GUID, guid);
        if (!user) return;
        this.players.forEach((player) => {
            if (player.guid === user.guid) {
                player.score = score;
                player.radius = radius;
                player.speed = speed;
            }
        });
        this.mustUpdate = true;
    }

    death(guid, socket) {
        this.players.forEach((player, i) => {
            if (player.guid === guid) {
                socket.emit('death');
                this.players.splice(i, 1);
                return;
            }
        });
    }

    join(guid, socket) {
        const user = this.mediator.get(this.mediator.TRIGGERS.GET_USER_BY_GUID, guid);
        if (!user) return;
        if (this.players.find(player => player.guid === user.guid)) return;
        const player = new Player(this.window, this._generateColor, socket.id);
        player.init(user.guid, user.nick);
        this.players.push(player.get());
        this.mustUpdate = true;
        socket.emit(this.SOCKETS.JOIN, { status: true, window: this.window, self: player.getSelf() });
    }

    move(data) {
        const { x, y, guid } = data;
        const user = this.mediator.get(this.mediator.TRIGGERS.GET_USER_BY_GUID, guid);
        if (!user) return;
        this.players.forEach((player) => {
            if (guid == user.guid) {
                player.x += x;
                player.y += y;
                if (player.x >= this.window.width) player.x = this.window.width;
                if (player.y >= this.window.height) player.y = this.window.height;
                if (player.x <= 0) player.x = 0;
                if (player.y <= 0) player.y = 0;
                this.mustUpdate = true;
                return;
            }
        });
    }

    getScene() {
        const food = this.foods;
        return { status: true, players: this.players, food };
    }
}

module.exports = GameManager;