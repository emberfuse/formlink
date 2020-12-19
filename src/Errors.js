class Errors {
    /**
     * Create new errors handler instance.
     */
    constructor() {
        this.errors = {};
    }

    /**
     * Get error message for given field.
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
     * Determine if the given field has.
     *
     * @param  {String}  field
     * @return {Boolean}
     */
    has(field) {
        return Boolean(this.errors[field]);
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
    clear(field) {
        delete this.errors[field];
    }

    /**
     * Clear all error messages and reset instance.
     */
    clearAll() {
        this.errors = {};
    }

    /**
     * Determine if any error messages are available in all registered fields.
     *
     * @return {Boolean}
     */
    any() {
        return Boolean(Object.keys(this.errors).length > 0);
    }
}

export default Errors;
