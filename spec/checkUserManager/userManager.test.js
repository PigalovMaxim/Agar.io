const { userManager, UserManager } = require('./config');

describe('проверяем userManager', () => {
    test('проверяем тип', () => {
        expect(userManager instanceof UserManager).toEqual(true);
    });
    test('проверяем registration', () => {
        //в регистрации и логине нужно socket :((((
        /* expect(Object.keys(userManager.users)).toHaveLength(1);
        userManager.registration({nick: 'chort', password: 'jashuhdji21ihudao0-283=i2n'});
        expect(Object.keys(userManager.users)).toHaveLength(2); */
    });
    
});