# Preflight JS

Preflight JS is a Form Object class created in order to make working with forms and validation errors more convenient. This package is automatically installed when using the Preflight PHP Framework.

Installing this package will allow you to create a new form object that will provide easy access to error messages, as well as conveniences such as resetting the form state on a successful form submission.

## Install

You can install Preflight JS using Node JS package manager.

```bash
npm i @thavarshan/preflight-js
```

Or add it directly to your `package.json` file:

```json
"dependencies": {
  "preflight-js": "1.3.1"
}
```

## Usage

Preflight uses **axios** to make requests to the backend server. A form may be submitted using the `post`, `put`, or `delete` methods. All of the data specified during the form's creation will be automatically included in the request. In addition, Basic request options may also be specified:

```javascript
const form = new Form({
    name: null,
    email: null,
});

form.post('/user/profile');
```

Form error messages may be accessed using the `form.error` method. This method will return the first available error message for the given field:

```html
<span v-text="form.error('email')"></span>
```

A flattened list of all validation errors may be accessed using the errors method. This method may prove useful when attempting to display the error message in a simple list:

```html
<li v-for="error in form.errors()">
    {{ error }}
</li>
```

Additional information about the form's current state is available via the `recentlySuccessful` and `processing` methods. These methods are helpful for dictating disabled or "in progress" UI states:

```html
<span :on="form.recentlySuccessful">Saved.</span>

<button :class="{ 'loading': form.processing }" :disabled="form.processing">Save</button>
```

Preflight JS is best used inside a JavaScript framework. Shown below is an example of how to use it inside Vue JS.

```javascript
import Form from 'preflight-js';

export default {
    data() {
        form: new Form({
            email: null,
            password: null,
            remember: true
        }),
    },

    methods: {
        async login() {
            await this.form.post('/login')
                .then(response => {
                    if (! this.form.hasErrors()) {
                        window.location = '/home';
                    }
                });
        }
    }
}
```

HTML template part of the Vue JS script shown above.

```html
<template>
    <form @submit.prevent="login">
        <div>
            <label>
                <span>Email address</span>
                <input type="email" v-model="form.email" />
            </label>

            <div v-show="form.hasError('email')">
                <span>{{ form.error('email') }}</span>
            </div>
        </div>

        <div>
            <label>
                <span>Password</span>
                <input type="password" v-model="form.password" />
            </label>

            <div v-show="form.hasError('password')">
                <span>{{ form.error('password') }}</span>
            </div>
        </div>

        <div>
            <button type="submit">Login</button>
        </div>
    </form>
</template>
```

### Uploading files via POST, PUT or PATCH request

To upload files via form object please specify which method is to be used via form object data and use POST request to make the actual request. An example is shown below.

```javascript
import Form from 'preflight-js';

export default {
    data() {
        form: new Form(
            {
                _method: 'PUT',
                name: null,
                email: null,
                photo: null,
            },
            {
                resetOnSuccess: false,
            }
        );
    },
    methods: {
        async updateProfile() {
            if (this.$refs.photo) {
                this.form.photo = this.$refs.photo.files[0];
            }

            await this.form.post(route('profile.update'));
        },
    },
};
```

### API & Available Methods

Given below is a list of all available methods that can be used on your application front.

```javascript
/**
 * Get all data as object assgined to form object.
 *
 * @return  {Object}
 */
withData(data);

/**
 * Assign options to be used by current instance of form object.
 *
 * @param   {Object}  options
 *
 * @return  {Form}
 */
withOptions(options);

/**
 * Make POST request with currently attached data object to given endpoint.
 *
 * @param   {String}  url
 * @param   {Object}  headers
 *
 * @return  {Promise}
 */
post(url, headers);

/**
 * Make PUT request with currently attached data object to given endpoint.
 *
 * @param   {String}  url
 * @param   {Object}  headers
 *
 * @return  {Promise}
 */
put(url, headers);

/**
 * Make PATCH request with currently attached data object to given endpoint.
 *
 * @param   {String}  url
 * @param   {Object}  headers
 *
 * @return  {Promise}
 */
patch(url, headers);

/**
 * Make DELETE request with currently attached data object to given endpoint.
 *
 * @param   {String}  url
 * @param   {Object}  headers
 *
 * @return  {Promise}
 */
delete (url, headers);

/**
 * Determine if the inputs bound to form have any related error messages.
 *
 * @return  {Boolean}
 */
hasErrors();

/**
 * Determine f the given form filed bound to the form object has an error message.
 *
 * @param   {String}  field
 *
 * @return  {Boolean}
 */
hasError(field);

/**
 * Get error message associated with the given form input.
 *
 * @param   {String}  field
 *
 * @return  {String}
 */
error(field);

/**
 * Save current data to initials object and empty current data registry.
 *
 * @return  {void}
 */
reset();
```

### Options For Form Object Data

Options for Form class can be set through the second optional argument passed to the newly created Form class.

```javascript
const data = {};
const options = {};

const form = new Form(data, options);
```

### Default Options Already Available

`resetOnSuccess`: (Boolean) reset all errors and currently bound form data to null. Currently set data will be saved to `initials` object.

`setInitialOnSuccess`: (Boolean) reset all errors and currently bound form data to null. Currently set data will be saved to `initials` object.

**Custom options can be set via argument.**

```javascript
const options = {
    customOption = 'customValue'
}
```
