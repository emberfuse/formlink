import Form from './Form';

export default {
    install(app) {
        app.prototype.$form = (data, options) => Form.create(data, options);
    },
};
