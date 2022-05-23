const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: "*" } });
const Common = require('../../application/modules/common/Common');
const Mediator = require('../../application/modules/Mediator');
const { MEDIATOR, SOCKETS } = require('../../config');
const common = new Common;
const mediator = new Mediator(MEDIATOR, SOCKETS);
const GameManager = require('../../application/modules/gameManager/GameManager');
const UserManager = require("../../application/modules/userManager/UserManager");
const userManager = new UserManager({ mediator, common, io});
const gameManager = new GameManager({ mediator, common, io });

module.exports = {userManager, UserManager};