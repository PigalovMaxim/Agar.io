const BaseModule = require('../BaseModule');

class GameManager extends BaseModule {
    constructor(options) {
        super(options);

        this.players = [];

        options.io.on('connection', socket => {
            socket.on('move', data => this.move(data, socket));
        });

        // Сюда надо писать set и subscribe
        this.mediator.subscribe(this.EVENTS.USER_LOGIN, user => this.join(user));

        this.mustUpdate = false;
        //start();
    }

    start() {
        setInterval(() => {
            if (this.mustUpdate) {
                this.mustUpdate = false;
                io.emit('getScene', mediator.get(mediator.TRIGGERS.GET_USERS));
            }
        }, 100);
    }

    kill(user){
        
    }

    join(user, data) {
        const { x, y, radius, color, speed } = data;
        const gamer = { 
            id: user.id, 
            nick: user.nick, 
            x, 
            y, 
            radius, 
            color, 
            speed
        };     
        this.gamers.push(gamer);
        this.mustUpdate = true;
        return true;
    }

    move(data, socket) {
        const { x, y, radius, speed } = data;
        const user = this.mediator.get(this.TRIGGERS.GET_USER, socket.id);
        if (x && y && user) {
            user.x = x;
            user.y = y;
            this.mustUpdate = true;
        }
    }
}

module.exports = GameManager;