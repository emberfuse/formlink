# Preflight JS

Preflight JS is a Form Object class created to make working with forms and validation errors more convenient. This package is automatically installed when using the Preflight PHP Framework.

Installing this package will add a new `form` method to Vue's global scope. The `form` method is used to create a new form object that will provide easy access to error messages, as well as conveniences such as resetting the form state on successful form submission.

## Install

You can install Preflight JS using Node JS package manager. Just run the below command inside your project to install it.

```bash
npm install @thavarshan/preflight-js
```

## Usage

Preflight uses **axios** to make requests to the backend server. A form may be submitted using the `post`, `put`, or `delete` methods. All of the data specified during the form's creation will be automatically included in the request. In addition, request headers may also be specified:

```javascript
data() {
    return {
        form: this.$form({
            name: this.name,
            email: this.email,
        }, {
            resetOnSuccess: true,
        }),
    }
},

methods: {
    updateProfile() {
        this.form.post('/user/profile', {
            Authorizations: `Bearer ${token}`;
        });
    }
}
```

Form error messages may be accessed using the `form.error` method. This method will return the first available error message for the given field:

```html
<span v-show="form.hasError('email')" v-text="form.error('email')"></span>
```

Additional information about the form's current state is available via the recentlySuccessful and processing methods. These methods help dictate disabled or "in progress" UI states:

```html
<span :on="form.recentlySuccessful">Saved.</span>

<button :class="{ 'opacity-25': form.processing }" :disabled="form.processing">Save</button>
```

To use Preflight JS inside your Vue JS project, import the module and register it as a Vue plugin, as shown below.

```javascript
import Vue from 'vue';
import Form from '@thavarshan/preflight-js';

Vue.use(Form);
```

You will then be able to use Preflight within your Vue components, as shown below.

```javascript
export default {
    data() {
        return {
            form: this.$form({
                email: null,
                password: null,
                remember: true,
            }),
        };
    },

    methods: {
        async login() {
            await this.form.post('/login').then(response => {
                if (!this.form.hasErrors()) {
                    window.location = '/home';
                }
            });
        },
    },
};
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

### Uploading files via POST, PUT, or PATCH request

To upload files via form object please specify which method is to be used via form object data and use a POST request to make the actual request. An example is shown below.

```javascript
export default {
    data() {
        return {
            form: this.$form(
                {
                    _method: 'PUT',
                    name: null,
                    email: null,
                    photo: null,
                },
                {
                    resetOnSuccess: false,
                }
            ),
        };
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

Given below is a list of all available methods that are available for use on your application front.

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

Preflight form object class comes with two default options `resetOnSuccess` which resets all errors and currently bound form data to null. Currently set data will be saved to the `initials` object. And `setInitialOnSuccess` which saves previously set data to the `initials` object.

**Custom options can be set via argument.**
Custom options can be set via the second argument passed to the `form` method.

```javascript
data() {
    return {
        form: this.$form({
            name: null,
            email: null
        }, {
            customOption: 'customValue,
        })
    }
}
```

## Contributing

Please read [CONTRIBUTING.md](https://github.com/Thavarshan/preflight-js/blob/main/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

-   **Thavarshan Thayananthajothy** - _Initial work_ - [Thavarshan](https://github.com/Thavarshan)

See also the list of [contributors](https://github.com/Thavarshan/preflight-js/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/Thavarshan/preflight-js/blob/main/LICENSE) file for details
