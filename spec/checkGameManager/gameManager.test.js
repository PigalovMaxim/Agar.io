const { gameManager, GameManager } = require('./config');
const guid = '52f50e46-eea7-1c84-7d2b-d6ec1b95c7c1';

/* beforeAll(() => {
    console.log('beforeALLLL');
});

afterEach(() => {
    console.log('afterEach');
}); */

describe('проверяем gameManager', () => {
    test('проверяем тип', () => {
        expect(gameManager instanceof GameManager).toEqual(true);
    });
    test('проверяем _createFood', () => {
        expect(gameManager.foods).not.toHaveLength(0);
    });
    test('проверяем _generateColor', () => {
        const color = gameManager._generateColor();
        expect(color).toBeDefined();
        expect(color).toHaveLength(7);
        expect(color[0]).toEqual('#');
    });
    test('проверяем eatFood', () => {
        const foodCountStart = gameManager.foods.length;
        gameManager.eatFood({index: 2, guid});
        expect(gameManager.foods).toHaveLength(foodCountStart - 1);
    });
    test('проверяем increaseSize', () => {
        expect(gameManager.players).toBeDefined();
        expect(gameManager.players[0]).toEqual({
            guid,
            score: 0,
            radius: 25,
            speed: 3,
            x: 0,
            y: 0
        });
        gameManager.increaseSize(100, 30, 4, guid);
        expect(gameManager.players[0]).toEqual({
            guid,
            score: 100,
            radius: 30,
            speed: 4,
            x: 0,
            y: 0
        });
    });
    test('проверяем move', () => {
        expect(gameManager.players).toBeDefined();
        expect(gameManager.players[0]).toHaveProperty('x', 0);
        expect(gameManager.players[0]).toHaveProperty('y', 0);
        gameManager.move({x: 50, y: 50, guid});
        expect(gameManager.players[0]).toHaveProperty('x', 50);
        expect(gameManager.players[0]).toHaveProperty('y', 50);
    });
    test('проверяем getScene', () => {
        const field = gameManager.getScene();
        expect(field).toHaveProperty('status');
        expect(field).toHaveProperty('players');
        expect(field).toHaveProperty('food');
    });
});