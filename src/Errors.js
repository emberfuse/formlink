import { arrayWrap } from './util/arrays';

class Errors {
    /**
     * Create new errors handler instance.
     */
    constructor() {
        this.errors = {};
    }

    /**
     * Get first error message for given field.
     *
     * @param  {String} field
     * @return {String}
     */
    get(field) {
        if (this.errors[field]) {
            return this.errors[field][0];
        }
    }

    /**
     * Get all the error messages for the given field.
     *
     * @param  {String} field
     * @return {Array}
     */
    getAll(field) {
        return arrayWrap(this.errors[field] || []);
    }

    /**
     * Determine if the given field has an error.
     *
     * @param  {String}  field
     * @return {Boolean}
     */
    has(field) {
        return this.errors.hasOwnProperty(field);
    }

    /**
     * Get all the errors in a flat array.
     *
     * @return {Array}
     */
    flatten() {
        return Object.values(this.errors).reduce((carry, element) => carry.concat(element), []);
    }

    /**
     * Get all the errors.
     *
     * @return {Object}
     */
    all() {
        return this.errors;
    }

    /**
     * Record error messages object.
     *
     * @param  {Object} errors
     */
    record(errors) {
        this.errors = errors;
    }

    /**
     * Clear message of given error field.
     *
     * @param  {String} field
     */
    clear(field = null) {
        if (field !== null) {
            delete this.errors[field];
        } else {
            this.errors = {};
        }
    }

    /**
     * Determine if any error messages are available in all registered fields.
     *
     * @return {Boolean}
     */
    any() {
        if (this.errors === 'undefined') {
            return true;
        }

        return Object.keys(this.errors).length > 0;
    }
}

export default Errors;
