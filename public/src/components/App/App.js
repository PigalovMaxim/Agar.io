import './App.css';
import {useState} from 'react';

import Canvas from '../Canvas';
import Menu from '../Menu/Menu';

import { io } from "socket.io-client";
const socket = io('http://localhost:3001/');

function App() {
  const [isGameStarted, startGame] = useState(false);
  return (
    <div className="App">
      <Canvas socket={socket} isGameStarted={isGameStarted}/>
      <Menu socket={socket} startGame={startGame}/>
    </div>
  );
}

export default App;
