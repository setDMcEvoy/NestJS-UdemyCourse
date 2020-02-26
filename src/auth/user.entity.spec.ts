import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

describe('User Entity', () => {
    describe('validatePassword', () => {
        let user: User;

        beforeEach(() => {
            user = new User();
            user.salt = 'testSalt';
            user.password = 'testPassword';
            bcrypt.hash = jest.fn();
        });

        it('returns true with valid password', async () => {
            bcrypt.hash.mockReturnValue('testPassword');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            const result = await user.validatePassword('testPassword');
            expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', 'testSalt');
            expect(result).toEqual(true);
        });

        it('returns false with invalid password', async () => {
            bcrypt.hash.mockReturnValue('wrongPassword');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            const result = await user.validatePassword('wrongPassword');
            expect(bcrypt.hash).toHaveBeenCalledWith('wrongPassword', 'testSalt');
            expect(result).toEqual(false);
        });
    });
});