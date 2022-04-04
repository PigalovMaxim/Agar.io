const CONFIG = {
    NAME: 'Eat Worker',
    VERSION: '0.0.1',
    PORT: 3001,
    
    MEDIATOR: {
        EVENTS: {
            USER_LOGIN: 'USER_LOGIN',
            USER_LOGOUT: 'USER_LOGOUT',
            USER_REGISTRATION: 'USER_REGISTRATION',
        },
        TRIGGERS: {
            GET_USER_BY_NICK: 'GET_USER_BY_NICK',
            GET_USER_BY_ID: 'GET_USER_BY_ID',
            LOGIN: 'LOGIN',
        }
    },   
    SOCKET: {
        CONNECTION: 'connection',
        DISCONNECT: 'disconnect',
        REGISTRATION: 'registration',
        GET_SCENE: 'getScene',
        LOGIN: 'login',
        MOVE: 'move',
        JOIN: 'join',
        EAT_PLAYER: 'eatPlayer',
        EAT_FOOD: 'eatFood',
        MESSAGE: 'message',
        INCREASE_SIZE: 'increaseSize'
    },
    DATABASE: {
        HOST: '',
        NAME: 'agar.db',
        USER: '',
        PASS: '',
    },
};

module.exports = CONFIG;