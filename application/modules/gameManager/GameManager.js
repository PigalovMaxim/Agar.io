const BaseModule = require('../BaseModule');

class GameManager extends BaseModule {
    constructor(options) {
        super(options);

        this.players = [];
        this.window = {width: 3000, height: 3000};
        this.camera = {width: 1200, height: 600};
        this.foods = [];
        this._createFood();

        options.io.on('connection', socket => {
            socket.on(options.SOCKET.MOVE, data => this.move(data, socket));
            socket.on(options.SOCKET.JOIN, response => this.join(response, socket));
            socket.on(options.SOCKET.GET_SCENE, response => this.getScene(response, socket.id));
        });

        // Сюда надо писать set и subscribe

        this.mustUpdate = true;
        start();
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
                 io.emit('getScene', this.mediator.get(this.mediator.TRIGGERS.GET_USERS)); 
            }
        }, 100);
    } 
    

    kill(user){
        
    }

    join(response, socket) {
        const user = this.mediator.get(this.mediator.TRIGGERS.GET_USER, socket.id);
        const player = { 
            id: socket.id, 
            nick: user.nick, 
            x: Math.round(Math.random()*this.window.width), 
            y: Math.round(Math.random()*this.window.height), 
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

    

    move(data, socket) {
        const { x, y } = data;
        const user = this.mediator.get(this.TRIGGERS.GET_USER, socket.id);
        if (x && y && user) {
            user.x = x;
            user.y = y;
            this.mustUpdate = true;
        }
    }

    getScene(response, id){
        const enemies = this.players.filter(player => id === player.id);
        const player = this.players.find(player => player.id === id);
        const food = this.foods;
        response({ status: true, enemies, player, food });
    }
}

module.exports = GameManager;

/*  Сделать правильную отправку getScene
    
*/ 