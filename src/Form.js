import axios from 'axios';
import Errors from './Errors';
import { serialize as objectToFormData } from 'object-to-formdata';
import {
    guardAgainstReservedFieldName,
    isArray,
    isFile,
    merge,
    reservedFieldNames
} from './helpers';

class Form {
    constructor(data = {}, options = {}) {
        this.processing = false;
        this.successful = false;
        this.recentlySuccessful = false;
        this.isDirty = false;

        this.withData(data).withOptions(options);

        this.errors = new Errors();

        return new Proxy(this, {
            set(obj, prop, value) {
                obj[prop] = value;

                if ((reservedFieldNames.indexOf(prop) === -1) && value !== obj.initial[prop]) {
                    obj.isDirty = true;
                }

                return true;
            }
        });
    }

    withData(data) {
        if (isArray(data)) {
            data = data.reduce((carry, element) => {
                carry[element];

                return carry;
            }, {});
        }

        this.setInitialValues(data);

        this.processing = false;
        this.successful = false;

        for (const field in data) {
            guardAgainstReservedFieldName(field);

            this[field] = data[field];
        }

        this.isDirty = false;

        return this;
    }

    setInitialValues(values) {
        this.initial = {};

        merge(this.initial, values);
    }

    withOptions(options) {
        this.__options = {
            resetOnSuccess: true,
            setInitialOnSuccess: false,
        };

        if (options.hasOwnProperty('resetOnSuccess')) {
            this.__options.resetOnSuccess = options.resetOnSuccess;
        }

        if (options.hasOwnProperty('setInitialOnSuccess')) {
            this.__options.setInitialOnSuccess = options.setInitialOnSuccess;
        }

        return this;
    }

    data() {
        const data = {};

        for (const property in this.initial) {
            data[property] = this[property];
        }

        return data;
    }

    reset() {
        merge(this, this.initial);

        this.isDirty = false;
    }

    post(url, options = {}) {
        return this.submit('post', url, options);
    }

    put(url, options = {}) {
        return this.submit('put', url, options);
    }

    patch(url, options = {}) {
        return this.submit('patch', url, options);
    }

    delete(url, options) {
        return this.submit('delete', url, options);
    }

    submit(requestType, url, options) {
        this.__validateRequestType(requestType);

        this.processing = true;
        this.successful = false;

        if (this.hasErrors()) {
            this.errors.clearAll();
        }

        return this.__makeRequest(url, requestType)
            .catch(this.onFail.bind(this))
            .then(this.onSuccess.bind(this));
    }

    __makeRequest(url, requestType) {
        if (requestType === 'delete') {
            return axios[requestType](url, { data: this.data() });
        }

        return axios[requestType](
            url, this.hasFiles() ? objectToFormData(this.data()) : this.data()
        );
    }

    hasFiles() {
        for (const property in this.initial) {
            if (this.hasFilesDeep(this[property])) {
                return true;
            }
        }

        return false;
    };

    hasFilesDeep(object) {
        if (object === null) {
            return false;
        }

        if (typeof object === 'object') {
            for (const key in object) {
                if (object.hasOwnProperty(key)) {
                    if (this.hasFilesDeep(object[key])) {
                        return true;
                    }
                }
            }
        }

        if (Array.isArray(object)) {
            for (const key in object) {
                if (object.hasOwnProperty(key)) {
                    return this.hasFilesDeep(object[key]);
                }
            }
        }

        return isFile(object);
    }

    onSuccess(response) {
        this.processing = false;

        if (! this.hasErrors()) {
            this.successful = true;
            this.recentlySuccessful = true;

            setTimeout(() => this.recentlySuccessful = false, 2000);
        }

        if (this.__options.resetOnSuccess) {
            this.reset();
        } else if (this.__options.setInitialOnSuccess) {
            this.setInitialValues(this.data());

            this.isDirty = false;
        }

        return response;
    }

    onFail(error) {
        this.errors.record(error.response.data.errors);

        this.processing = false;
        this.successful = false;
        this.recentlySuccessful = false;
    }

    hasErrors() {
        return this.errors.any();
    }

    hasError(field) {
        return this.hasErrors() && this.errors.has(field);
    }

    error(field) {
        return this.errors.get(field);
    }

    __validateRequestType(requestType) {
        const requestTypes = ['get', 'post', 'put', 'patch', 'delete'];

        if (requestTypes.indexOf(requestType) === -1) {
            throw new Error(
                `\`${requestType}\` is not a valid request type, ` + `must be one of: \`${requestTypes.join('`, `')}\`.`
            );
        }
    }
}

export default Form;
