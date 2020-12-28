import Errors from '@/Errors';

let errors;

beforeEach(() => {
    errors = new Errors();
});

describe('Errors', () => {
    test('set errors', () => {
        expect(errors.errors).toEqual({});

        errors.record({ username: ['Value is required'] });

        expect(errors.errors).toEqual({ username: ['Value is required'] });
    });

    test('get all errors', () => {
        const allErrors = { username: ['Value is required'] };

        errors.record(allErrors);

        expect(errors.all()).toEqual(allErrors);
    });

    test('determine if there is an error for a field', () => {
        errors.record({ username: ['Value is required'] });

        expect(errors.has('username')).toBeTruthy();
    });

    test('determine if there are any errors', () => {
        errors.record({ username: ['Value is required'] });

        expect(errors.any()).toBeTruthy();
    });

    test('get the first error message for a field', () => {
        errors.record({ username: ['Value is required', 'Value must be unique'] });

        expect(errors.get('username')).toBe('Value is required');
        expect(errors.get('password')).toBeUndefined();
    });

    test('get all the error message for a field', () => {
        errors.record({ username: ['Value is required', 'Value must be unique'] });

        expect(errors.getAll('username')).toEqual(['Value is required', 'Value must be unique']);
    });

    test('get all the errors in a flat array', () => {
        errors.record({
            username: ['Username is required'],
            email: ['Email is required', 'Email is not valid'],
        });

        expect(errors.flatten()).toEqual([
            'Username is required',
            'Email is required',
            'Email is not valid',
        ]);
    });

    test('clear one error field', () => {
        errors.record({ username: ['Value is required'], password: ['Value is required'] });

        errors.clear('username');

        expect(errors.has('username')).toBeFalsy();
        expect(errors.has('password')).toBeTruthy();
    });

    test('clear all the error fields', () => {
        errors.record({ username: ['Value is required'], password: ['Value is required'] });

        errors.clear();

        expect(errors.any()).toBeFalsy();
    });
});
