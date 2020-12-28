import axios from 'axios';
import Errors from './Errors';
import { serialize as objectToFormData } from 'object-to-formdata';
import { guardAgainstReservedFieldName, isArray, isFile, merge, reservedFieldNames } from './util';

class Form {
    /**
     * Create new instanc of form object.
     *
     * @param   {Object}  data
     * @param   {Object}  options
     *
     * @return  {Proxy}
     */
    constructor(data = {}, options = {}) {
        this.resetStatus();
        this.isDirty = false;

        this.withData(data).withOptions(options);

        this.errors = new Errors();

        return new Proxy(this, {
            set(obj, prop, value) {
                obj[prop] = value;

                if (reservedFieldNames.indexOf(prop) === -1 && value !== obj.initial[prop]) {
                    obj.isDirty = true;
                }

                return true;
            },
        });
    }

    /**
     * Create static instance of form object.
     *
     * @param   {Object}  data
     * @param   {Object}  options
     *
     * @return  {Form}
     */
    static create(data = {}, options = {}) {
        return new Form(data, options);
    }

    /**
     * Assign data to current instance of form object.
     *
     * @param   {Object}  data
     *
     * @return  {Form}
     */
    withData(data) {
        if (isArray(data)) {
            data = data.reduce((carry, element) => {
                carry[element] = '';

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

    /**
     * Set initial/original values of form data.
     *
     * @param   {Object}  values
     *
     * @return  {void}
     */
    setInitialValues(values) {
        this.initial = {};

        merge(this.initial, values);
    }

    /**
     * Assign options to be used by current instance of form object.
     *
     * @param   {Object}  options
     *
     * @return  {Form}
     */
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

    /**
     * Get all data as object assgined to form object.
     *
     * @return  {Object}
     */
    data() {
        const data = {};

        for (const property in this.initial) {
            data[property] = this[property];
        }

        return data;
    }

    /**
     * Save current data to initials object and empty current data registry.
     *
     * @return  {void}
     */
    reset() {
        merge(this, this.initial);

        for (const key in this.data) this.data[key] = null;

        this.isDirty = false;
    }

    /**
     * Make GET request with currently attached data object to given endpoint.
     *
     * @param   {String}  url
     * @param   {Object}  config
     *
     * @return  {Promise}
     */
    get(url, config = {}) {
        return this.__submit('get', url, config);
    }

    /**
     * Make POST request with currently attached data object to given endpoint.
     *
     * @param   {String}  url
     * @param   {Object}  config
     *
     * @return  {Promise}
     */
    post(url, config = {}) {
        return this.__submit('post', url, config);
    }

    /**
     * Make PUT request with currently attached data object to given endpoint.
     *
     * @param   {String}  url
     * @param   {Object}  config
     *
     * @return  {Promise}
     */
    put(url, config = {}) {
        return this.__submit('put', url, config);
    }

    /**
     * Make PATCH request with currently attached data object to given endpoint.
     *
     * @param   {String}  url
     * @param   {Object}  config
     *
     * @return  {Promise}
     */
    patch(url, config = {}) {
        return this.__submit('patch', url, config);
    }

    /**
     * Make DELETE request with currently attached data object to given endpoint.
     *
     * @param   {String}  url
     * @param   {Object}  config
     *
     * @return  {Promise}
     */
    delete(url, config = {}) {
        return this.__submit('delete', url, config);
    }

    /**
     * Make given request type with currently attached data object to given endpoint.
     *
     * @param   {String}  url
     * @param   {Object}  config
     *
     * @return  {Promise}
     */
    __submit(requestType, url, config = {}) {
        this.startProcessing();

        this.__validateRequestType(requestType);

        return this.__makeRequest(url, requestType, config)
            .catch(this.onFail.bind(this))
            .then(this.onSuccess.bind(this));
    }

    /**
     * Make the actual form submission request.
     *
     * @param   {String}  url
     * @param   {String}  requestType
     * @param   {Object}  config
     *
     * @return  {Promise}
     */
    __makeRequest(url, requestType, config = {}) {
        this.startProcessing();

        requestType = requestType.toLowerCase();

        const data = requestType === 'get' ? { param: this.data } : this.data();

        return new Promise((resolve, reject) => {
            axios
                .request({
                    url,
                    method: requestType,
                    data: this.hasFiles() ? objectToFormData(data) : data,
                    headers: {
                        Accept: 'text/html, application/xhtml+xml, application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    ...config,
                })
                .then((response) => resolve(response))
                .catch((error) => reject(error));
        });
    }

    /**
     * Determine if the data attached contains file data.
     *
     * @return  {Boolean}
     */
    hasFiles() {
        for (const property in this.initial) {
            if (this.hasFilesDeep(this[property])) {
                return true;
            }
        }

        return false;
    }

    /**
     * Determine if file data are available embedded into the data object.
     *
     * @param   {Object}  object
     *
     * @return  {Boolean}
     */
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

    /**
     * Actions to be performed on successful request response.
     *
     * @param   {Object}  response
     *
     * @return  {Object}
     */
    onSuccess(response) {
        this.processing = false;

        if (!this.hasErrors()) {
            this.successful = true;
            this.recentlySuccessful = true;

            setTimeout(() => (this.recentlySuccessful = false), 2000);
        }

        if (this.__options.resetOnSuccess) {
            this.reset();
        } else if (this.__options.setInitialOnSuccess) {
            this.setInitialValues(this.data());

            this.isDirty = false;
        }

        return response;
    }

    /**
     * Actions to be performed on failed request attempt.
     *
     * @param   {Object}  error
     *
     * @return  {void}
     */
    onFail(error) {
        if (error !== null && !error.response) {
            this.resetStatus();

            throw error;
        }

        this.errors.record(this.extractErrors(error.response));

        this.resetStatus();
    }

    /**
     * Extract the errors from the response object.
     *
     * @param  {Object} response
     * @return {Object}
     */
    extractErrors(response) {
        if (!response.data || typeof response.data !== 'object') {
            return { error: 'Something went wrong. Please try again.' };
        }

        if (response.data.errors) {
            return { ...response.data.errors };
        }

        if (response.data.message) {
            return { error: response.data.message };
        }

        return { ...response.data };
    }

    startProcessing() {
        if (this.hasErrors()) {
            this.errors.clear();
        }

        this.processing = true;
        this.successful = false;
    }

    /**
     * Reset status properties.
     *
     * @return  {void}
     */
    resetStatus() {
        this.processing = false;
        this.successful = false;
        this.recentlySuccessful = false;
    }

    /**
     * Determine if the inputs bound to form have any related error messages.
     *
     * @return  {Boolean}
     */
    hasErrors() {
        return this.errors.any();
    }

    /**
     * Determine f the given form filed bound to the form object has an error message.
     *
     * @param   {String}  field
     *
     * @return  {Boolean}
     */
    hasError(field) {
        return this.hasErrors() && this.errors.has(field);
    }

    /**
     * Get error message associated with the given form input.
     *
     * @param   {String}  field
     *
     * @return  {String}
     */
    error(field) {
        return this.errors.get(field);
    }

    /**
     * Get all the errors associated with the form in a flat array.
     *
     * @return  {String}
     */
    errors() {
        return this.errors.flatten();
    }

    /**
     * Determine if the given request type is supported.
     *
     * @param   {String}  requestType
     *
     * @return  {void}
     */
    __validateRequestType(requestType) {
        const requestTypes = ['get', 'post', 'put', 'patch', 'delete'];

        if (requestTypes.indexOf(requestType) === -1) {
            throw new Error(
                `\`${requestType}\` is not a valid request type, ` +
                    `must be one of: \`${requestTypes.join('`, `')}\`.`
            );
        }
    }
}

export default Form;
