const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server,  {cors: {origin: "*"}});

const Mediator = require('./application/modules/Mediator');
const UserManager = require("./application/modules/userManager/UserManager");
const GameManager = require("./application/modules/gameManager/GameManager");


/*app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000/');
   res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);z
    next();
});*/


const { PORT, NAME, VERSION, MEDIATOR, SOCKET } = require('./config');
const mediator = new Mediator(MEDIATOR);
new UserManager({ mediator, io, SOCKET });
new GameManager({ mediator, io, SOCKET });

const Router = require("./application/router/Router");
const router = new Router({ mediator });

io.on('connection', socket => {
    console.log('connected ', socket.id);
    socket.on('disconnect', () => console.log('disconnect', socket.id));
});

app.use(express.static(__dirname + "/public"));
app.use("/", router);

server.listen(PORT, () => console.log(`App ${NAME} version ${VERSION}`));

/*
Мы впихиваем сокет айди в массив когда юзер конектится
сокет айди мы привязываем к нику чтобы в дальнейшем в верхнем правом углу выводит список игроков и их очки
*/ 
