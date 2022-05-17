const { gameManager, GameManager } = require('./config');

beforeAll(() => {
    console.log('beforeALLLL');
});

afterEach(() => {
    console.log('afterEach');
});

describe('чекаем gameManager', () => {
    test('gameManager', () => {
        expect(gameManager instanceof GameManager).toEqual(true);
    });
});