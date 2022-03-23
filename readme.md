
# objects
1. Player = { nick, id, x, y, radius, color, speed, score }
2. Food = { x, y }
# need
1. login (login, hash, rnd) => true или false
2. registration (login, hash) => true или false
3. join (nick, id, x, y, radius, color, speed) => getScene
4. getScene () => [ 
    enemies { nick, id, x, y, radius, color, speed }, 
    player { nick, id, x, y, radius, color, speed }, 
    food { x, y } 
]
5. death () => score

# done