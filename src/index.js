import Form from './Form';

export default {
    install(app, options = {}) {
        if (options.hasOwnProperty('data')) {
            const data = options.data;
        }

        if (options.hasOwnProperty('configurations')) {
            const configurations = options.configurations;
        }

        app.prototype.$form = (data, configurations) => Form.create(data, configurations);
    },
};
