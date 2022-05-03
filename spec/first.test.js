//Вынести в конфигу
const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: "*" } });
const Common = require('../application/modules/common/Common');
const Mediator = require('../application/modules/Mediator');
const { MEDIATOR, SOCKETS } = require('../config');
const common = new Common;
const mediator = new Mediator(MEDIATOR, SOCKETS);
const GameManager = require('../application/modules/gameManager/GameManager');
const UserManager = require("../application/modules/userManager/UserManager");
const gameManager = new GameManager({ mediator, common, io });

describe('чекаем gameManager', () => {
    test('это внатуре gameManager?', () => {
        expect(gameManager instanceof GameManager).toEqual(true);
    });

    test('check _generateColor', () => {

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(gameManager._generateColor());
        expect(result).toEqual(result);
    });

    test('check getUserByGuid', (guid) => { 
        const user = UserManager.getUserByGuid(guid);
    });


});