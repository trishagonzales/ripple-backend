import validate from '../../src/api/middleware/validate';

describe('validate middleware', () => {
	describe('signup', () => {
		const schema = 'signup';

		it('should throw an exception', async () => {
			const input = { email: 1, password: 'password' };

			expect(await validate(input, schema)).toThrow('Invalid Input. "email" must be a string');
		});

		it('should return back the valid input', async () => {
			const input = {
				email: 'email@gmail.com',
				password: 'password',
				name: { firstName: 'Lj', lastName: 'Gonzales' }
			};

			const result = await validate(input, schema);

			expect(result).toBe(input);
		});
	});
});
