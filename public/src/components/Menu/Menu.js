import React, { useState } from "react";

import md5 from 'md5';
import cn from "classnames";

import s from "./Menu.module.css";
import { config } from "../../config";

const Menu = (props) => {
  const { startGame, socket } = props;
  const nickInput = React.createRef();
  const passwordInput = React.createRef();
  const [isHidden, HideMenu] = useState(false);
  const [isOff, TurnMenuOff] = useState(false);
  const [isLogin, Login] = useState(false);
  const turnMenuOff = () => {
    HideMenu(true);
    setTimeout(() => TurnMenuOff(true), 250);
  };
  return (
    <div
      className={cn(s.menu, isHidden ? s.hide : "", isOff ? s.disactive : "")}
    >
      {
        (!isLogin) ?
        <div className={s.form}>
          <input ref={nickInput} className={s.input} placeholder="Никнейм" />
          <input ref={passwordInput} className={s.input} placeholder="Пароль" />
          <button
            onClick={() => {
              const rand = Math.random() * 100000;
              console.log('pizda');
              socket.emit('login', { 
                nick: nickInput.current.value,
                hash: md5(md5(nickInput.current.value + passwordInput.current.value) + rand),
                rand: rand
              }, response => {
                if( response.status ) Login(true);
              });
            }}
            className={s.button}
          >
            Войти
          </button>
          <button onClick={() => {
            socket.emit('registration', { 
              nick: nickInput.current.value,
              hash: md5(nickInput.current.value + passwordInput.current.value)
            }, response => {
              if( response.status ) {
                config.id = response.id;
                Login(true);
              }
            });
          }
          } className={s.button}>Регистрация</button>
        </div> 
        :
        <div className={s.form}>
          <label className={s.nickname}></label>
          <button onClick={() => {
              socket.emit('join', response => {
                if( response.status ) {
                  config.WINDOW.HEIGHT = response.window.height;
                  config.WINDOW.WIDTH = response.window.width;
                  config.camera.height = response.camera.height;
                  config.camera.width = response.camera.width;
                  turnMenuOff();
                  startGame(true);
                }
              });
            }} className={s.button}>Зайти в игру</button>
          <button className={s.button}>Выйти нельзя</button>
        </div>
      }
    </div>
  );
};

export default Menu;
