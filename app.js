const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: "*" } });

const Common = require('./application/modules/common/Common');
const DB = require('./application/modules/db/DB');
const Mediator = require('./application/modules/Mediator');
const UserManager = require("./application/modules/userManager/UserManager");
const GameManager = require("./application/modules/gameManager/GameManager");

const { PORT, NAME, VERSION, MEDIATOR, SOCKETS, DATABASE } = require('./config');
const common = new Common;
const mediator = new Mediator(MEDIATOR, SOCKETS);
const db = new DB(DATABASE, mediator);
new UserManager({ mediator, io, db, common });
new GameManager({ mediator, io, db, common });

const Router = require("./application/router/Router");
const router = new Router({ mediator });

io.on('connection', socket => {
    console.log('connected ', socket.id);
    socket.on('disconnect', () => console.log('disconnect', socket.id));
});

app.use(express.static(__dirname + "/public"));
app.use("/", router);

function deinitModules() {
    db.destructor();
    setTimeout(() => process.exit(), 500);
}

//process.on();
process.on('SIGINT', deinitModules);

server.listen(PORT, () => console.log(`App ${NAME} version ${VERSION}`));