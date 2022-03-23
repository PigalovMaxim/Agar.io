const BaseModule = require('../BaseModule');

class GameManager extends BaseModule {
    constructor(options) {
        super(options);
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

    join(user) {
        user.x = 300;
        user.y = 301;
        user.radius = 25;
        user.color = '#f00';
        this.mustUpdate = true;
    }

    move(data = {}, socket) {
        const { x, y } = data;
        const user = this.mediator.get(this.TRIGGERS.GET_USER, socket.id);
        if (x && y && user) {
            user.x = x;
            user.y = y;
            this.mustUpdate = true;
        }
    }
}

module.exports = GameManager;