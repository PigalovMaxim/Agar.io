
# objects
1. Player = { nick, id, x, y, radius, color, speed, score }
2. Food = { x, y }
# Server Data
1. widnow = {width, height} // длина и ширина игрового поля
2. camera = {width, height} // длина и ширина стартовой камеры (по стандарту 1200 на 600)
3. food = [{ x, y }] // массив точек (еды)
4. enemies = Player[] // массив игроков
# need
1. login (login, hash, rnd) => true или false
2. registration (login, hash) => true или false
3. join (nick, id, x, y, radius, color, speed) => true или false
4. getScene () => [ 
    enemies { nick, id, x, y, radius, color, speed }, 
    player { nick, id, x, y, radius, color, speed }, 
    food { x, y } 
]
5. death () => score

# done
