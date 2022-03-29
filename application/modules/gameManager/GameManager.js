const BaseModule = require('../BaseModule');

class GameManager extends BaseModule {
    constructor(options) {
        super(options);
        this.io = options.io;
        this.players = [];
        this.window = {width: 3000, height: 3000};
        this.camera = {width: 1200, height: 600};
        this.foods = [];
        this._createFood();

        this.io.on('connection', socket => {
            socket.on(options.SOCKET.MOVE, data => this.move(data, socket.id));
            socket.on(options.SOCKET.JOIN, response => this.join(response, socket));
            socket.on(options.SOCKET.EAT_FOOD, index => this.eatFood(index, socket.id));
            socket.on(options.SOCKET.EAT_PLAYER, eatedId => this.eatPlayer(eatedId, socket.id));
            socket.on(options.SOCKET.GET_SCENE, () => this.getScene());
        });

        // Сюда надо писать set и subscribe

        this.mustUpdate = true;
        this.start();
    }

    _createFood(){
        for(let i = 0; i < Math.round(this.window.width/3); i++){
            const food = {
                x: Math.round(Math.random() * this.window.width), 
                y: Math.round(Math.random() * this.window.height)
            };
            this.foods.push(food);
        }
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
        }, 100);
    } 
    
    eatFood(index, id){
        this.foods.splice(index, 1);
        this.players.forEach((player, i) => {
            if(player.id === id){
                player.score += 10;
                player.radius += 0.1;
                player.speed -= 0.01;
                if(player.speed <= 0.01) player.speed = 0.1;
            }
        });
        this.mustUpdate = true;
    }

    eatPlayer(eatedId, id){
        let eatedPlayer = null;
        this.players.forEach((player, i) => {
            if(player.id === eatedId){
                this.io.to(eatedId).emit('death');
                eatedPlayer = player;
                this.players.splice(i, 1);
            }
        });

        this.players.forEach((player, i) => {
            if(player === id){
                player.score += eatedPlayer.radius;
                player.radius += Math.round(eatedPlayer.radius / 20);
                player.speed -= Math.round(eatedPlayer.radius / 2000);
            }
        }); 
    }

    join(response, socket) {
        const user = this.mediator.get(this.mediator.TRIGGERS.GET_USER, socket.id);
        const player = { 
            id: socket.id, 
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
        response({ 
            status: true,
            window: this.window,
            camera: this.camera,
        });
    }

    

    move(data, id) {
        const { x, y }  = data;
        this.players.forEach( (player) => {
            if(player.id == id){
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

/*  
    пофиксить хуйню огромную
*/ 