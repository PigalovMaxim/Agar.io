const BaseModule = require('../BaseModule');

class GameManager extends BaseModule {
    constructor(options) {
        super(options);
        this.players = [];
        this.window = {width: 3000, height: 3000};
        this.camera = {width: 1200, height: 600};
        this.foods = [];
        this._createFood();

        this.io.on('connection', socket => {
            socket.on(this.SOCKETS.MOVE, data => this.move(data));
            socket.on(this.SOCKETS.JOIN, token => this.join(token, socket));
            socket.on(this.SOCKETS.EAT_FOOD, data => this.eatFood(data, socket.id));
            socket.on(this.SOCKETS.EAT_PLAYER, data => this.eatPlayer(data, socket.id));
            socket.on(this.SOCKETS.INCREASE_SIZE, (score, radius, speed, token) => this.increaseSize(score, radius, speed, token));
            socket.on(this.SOCKETS.DISCONNECT, () => this.disconnect(socket.id));
        });

        this.mustUpdate = true;
        this.start();
    }

    disconnect(id){
        this.mediator.get(this.TRIGGERS.DISCONNECT, id);
    }

    _createFood(){
        for(let i = 0; i < Math.round(this.window.width/3); i++){
            const food = {
                x: Math.round(Math.random() * this.window.width), 
                y: Math.round(Math.random() * this.window.height)
            };
            this.foods.push(food);
        }
        this.mustUpdate = true;
    }

    _generateColor(){
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
    
    eatFood({index, token}){
        const user = this.mediator.get(this.mediator.TRIGGERS.GET_USER_BY_TOKEN, token);
        if(!user) return;
        this.foods.splice(index, 1);
        this.mustUpdate = true;
    }

    increaseSize(score, radius, speed, token) {
        const user = this.mediator.get(this.mediator.TRIGGERS.GET_USER_BY_TOKEN, token);
        if(!user) return;
        this.players.forEach((player, i) => {
            if(player.id === user.id){
                player.score = score;
                player.radius = radius;
                player.speed = speed;
            }
        });
        this.mustUpdate = true;
    }

    eatPlayer({eatedId, token}){
        const user = this.mediator.get(this.mediator.TRIGGERS.GET_USER_BY_TOKEN, token);
        if(!user) return;
        this.players.forEach((player, i) => {
            if(player.id === eatedId){
                this.io.to(eatedId).emit('death');
                this.players.splice(i, 1);
            }
        });
        this.mustUpdate = true;
    }

    join(token, socket) {
        const user = this.mediator.get(this.mediator.TRIGGERS.GET_USER_BY_TOKEN, token);
        if(!user) return;
        if(this.players.find(player => player.id === user.id)) return;
        const player = { 
            id: user.id, 
            nick: user.nick, 
            x: Math.round(Math.random()*this.window.width), 
            y: Math.round(Math.random()*this.window.height), 
            score: 0,
            radius: 25, 
            color: this._generateColor(), 
            speed: 3
        };
        this.players.push(player);
        this.mustUpdate = true;
        socket.emit(this.SOCKETS.JOIN, {status: true, window: this.window, camera: this.camera, id: user.id});
    }
    
    move(data) {
        const { x, y, token}  = data;
        const user = this.mediator.get(this.mediator.TRIGGERS.GET_USER_BY_TOKEN, token);
        if(!user) return;
        this.players.forEach( (player) => {
            if(player.id == user.id){
                player.x += x;
                player.y += y;
                if(player.x >= this.window.width) player.x = this.window.width;
                if(player.y >= this.window.height) player.y = this.window.height;
                if(player.x <= 0) player.x = 0;
                if(player.y <= 0) player.y = 0;
                this.mustUpdate = true;
            }
        });
    }

    getScene(){
        const food = this.foods;
        return { status: true, players: this.players, food };
    }
}

module.exports = GameManager;