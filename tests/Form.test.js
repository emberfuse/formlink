import Form from '@/Form';
import Errors from '@/Errors';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { serialize as objectToFormData } from 'object-to-formdata';

let form;
let mockAdapter;

beforeEach(() => {
    form = new Form({
        username: 'foo',
        password: 'bar',
    });

    mockAdapter = new MockAdapter(axios);
});

describe('Form', () => {
    test('instantiates the form properties', () => {
        expect(form.processing).toBeFalsy();
        expect(form.successful).toBeFalsy();
        expect(form.recentlySuccessful).toBeFalsy();
        expect(form.isDirty).toBeFalsy();
        expect(form.errors).toEqual(new Errors());
    });

    test('exposes the passed form field values as properties', () => {
        expect(form.username).toBe('foo');
        expect(form.password).toBe('bar');
    });

    test('gets the form data', () => {
        expect(form.data()).toEqual({
            username: 'foo',
            password: 'bar',
        });
    });

    test('can set original form data to initial property', () => {
        form.setInitialValues({
            username: 'foo',
            password: 'bar',
        });

        expect(form.initial).toEqual({
            username: 'foo',
            password: 'bar',
        });
    });

    test('sets original form data to initial property on instanciation', () => {
        expect(form.initial).toEqual({
            username: 'foo',
            password: 'bar',
        });
    });

    test('gets the form options', () => {
        expect(form.__options).toEqual({
            resetOnSuccess: true,
            setInitialOnSuccess: false,
        });
    });

    test('reset form statue', () => {
        form.resetStatus();

        expect(form.processing).toBeFalsy();
        expect(form.successful).toBeFalsy();
        expect(form.recentlySuccessful).toBeFalsy();
    });

    test('start processing the form', () => {
        form.startProcessing();

        expect(form.processing).toBeTruthy();
        expect(form.successful).toBeFalsy();
        expect(form.hasErrors()).toBeFalsy();
    });

    test('clear the form errors', () => {
        form.errors.clear();

        expect(form.hasErrors()).toBeFalsy();
    });

    test('submit the form successfully', async () => {
        mockAdapter.onPost('/login').reply(200);

        const customForm = new Form();

        await customForm.post('/login');

        expect(customForm.processing).toBeFalsy();
        expect(customForm.successful).toBeTruthy();
        expect(customForm.hasErrors()).toBeFalsy();
    });

    test('transform data object to FormData', async () => {
        const customForm = new Form({
            __method: 'PUT',
            username: 'foo',
            password: 'bar',
            photo: null,
        });

        customForm.photo = new File([new Uint8Array(10)], { type: 'image/png' });

        mockAdapter.onPut('/user/photo').reply((config) => {
            expect(config.data).toBeInstanceOf(FormData);
            expect(config.data.has('photo')).toBeTruthy();
            expect(config.data.has('username')).toBeTruthy();

            return [200, {}];
        });

        await customForm.post('/user/photo');
    });

    test('set errors from the server', async () => {
        mockAdapter.onPost('/login').reply(422, {
            username: ['Username is required'],
        });

        const customForm = new Form({});

        try {
            await customForm.post('/login');
        } catch (error) {}

        expect(customForm.hasErrors()).toBeTruthy();
        expect(customForm.processing).toBeFalsy();
        expect(customForm.successful).toBeFalsy();
    });

    test('extract the errors from the response object', () => {
        let response = {};
        expect(form.extractErrors(response)).toEqual({
            error: 'Something went wrong. Please try again.',
        });

        response = { data: 'invalid json' };
        expect(form.extractErrors(response)).toEqual({
            error: 'Something went wrong. Please try again.',
        });

        response = { data: { errors: { username: ['Username is required'] } } };
        expect(form.extractErrors(response)).toEqual({ username: ['Username is required'] });

        response = { data: { message: 'Username is required' } };
        expect(form.extractErrors(response)).toEqual({ error: 'Username is required' });

        response = { data: { username: ['Username is required'] } };
        expect(form.extractErrors(response)).toEqual({ username: ['Username is required'] });
    });

    test('submit the form using custom axios instance', async () => {
        mockAdapter.onPost('/login').reply(200);

        const customAxios = axios;
        const customForm = new Form({
            axios: customAxios,
        });

        await customForm.post('/login');

        expect(customForm.processing).toBeFalsy();
        expect(customForm.successful).toBeTruthy();
        expect(customForm.hasErrors()).toBeFalsy();
        expect(customForm.axios).toBeDefined();
        expect(customForm.axios).toEqual(customAxios);
    });
});
