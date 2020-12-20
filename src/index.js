import Form from './Form';

export default {
    install(app) {
        app.prototype.$form = (data = {}, options = {}) => {
            return Form.create(data, options);
        };
    },
};
