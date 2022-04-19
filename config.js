const CONFIG = {
    NAME: 'Oval.io',
    VERSION: '1.0.0',
    PORT: 3001,
    
    MEDIATOR: {
        EVENTS: {
            USER_LOGIN: 'USER_LOGIN',
            USER_LOGOUT: 'USER_LOGOUT',
            USER_REGISTRATION: 'USER_REGISTRATION',
        },
        TRIGGERS: {
            GET_USER_BY_NICK: 'GET_USER_BY_NICK',
            GET_USER_BY_TOKEN: 'GET_USER_BY_TOKEN',
            GET_USER_BY_ID: 'GET_USER_BY_ID',
            LOGIN: 'LOGIN',
            DISCONNECT: 'disconnect',
        }
    },   
    SOCKETS: {
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