import React, { useEffect } from "react";

import Game from '../../classes/Game.js';

const Canvas = (props) => {
  const canv = React.createRef();
  const { isGameStarted, socket } = props;
  useEffect(() => {
    const ctx = canv.current.getContext("2d");
    let game = null;
    if(isGameStarted) {
      game = new Game({canv, ctx, socket});
      game.start();
      canv.current.addEventListener("mousemove", game.mousemove);
    }
    return () => {
      if(isGameStarted) canv.current.removeEventListener("mousemove", game.mousemove);
    };
  });
  return <canvas ref={canv}></canvas>;
};

export default Canvas;
