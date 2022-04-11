const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server,  {cors: {origin: "*"}});

const DB = require('./application/modules/db/DB');
const Mediator = require('./application/modules/Mediator');
const UserManager = require("./application/modules/userManager/UserManager");
const GameManager = require("./application/modules/gameManager/GameManager");

const { PORT, NAME, VERSION, MEDIATOR, SOCKETS, DATABASE } = require('./config');
const mediator = new Mediator(MEDIATOR, SOCKETS);
const db = new DB(DATABASE, mediator);
new UserManager({ mediator, io, db});
new GameManager({ mediator, io, db });

const Router = require("./application/router/Router");
const router = new Router({ mediator });

io.on('connection', socket => {
    console.log('connected ', socket.id);
    socket.on('disconnect', () => console.log('disconnect', socket.id));
});

app.use(express.static(__dirname + "/public"));
app.use("/", router);

server.listen(PORT, () => console.log(`App ${NAME} version ${VERSION}`));

function deinitModules() {
    db.destructor();
    setTimeout(() => process.exit(), 500);
}

//process.on();
process.on('SIGINT', deinitModules);
