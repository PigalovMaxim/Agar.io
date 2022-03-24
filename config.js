const CONFIG = {
    NAME: 'Eat Worker',
    VERSION: '0.0.1',
    PORT: 3000,
    
    MEDIATOR: {
        EVENTS: {
            USER_LOGIN: 'USER_LOGIN',
            USER_LOGOUT: 'USER_LOGOUT',
            USER_REGISTRATION: 'USER_REGISTRATION',
        },
        TRIGGERS: {
            GET_USER: 'GET_USER',
            GET_USERS : 'GET_USERS',
        }
    },

    SOCKET: {
        CONNECTION: 'connection',
        DISCONNECT: 'disconnect',
        REGISTRATION: 'registration',
        LOGIN: 'login',
        MOVE: 'move',
        JOIN: 'join',
        KILL: 'kill',
        EAT: 'eat',
    }
}

module.exports = CONFIG;