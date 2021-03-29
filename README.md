# Formlink

![npm](https://img.shields.io/npm/dw/formlink) ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/Thavarshan/formlink/ Tests) ![npm](https://img.shields.io/npm/v/formlink)

Formlink is a Form Object class created to make working with forms and validation errors more convenient.

Installing this package will add a new `form` method to Vue's global scope which can then be accessed through `Vue.$form()` method. The `form` method is used to create a new form object that will provide easy access to error messages, as well as conveniences such as resetting the form state on successful form submission.

## Install

You can install Formlink using Node JS package manager. Just run the below command inside your project to install it.

```bash
npm install formlink --save
```

## Usage

To use Formlink inside your Vue JS project, import the module and register it as a Vue plugin, as shown below.

```javascript
import Vue from 'vue';
import Form from 'formlink';

Vue.use(Form);
```

You will then be able to use Formlink within your Vue components using the `form` method:

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

<script>
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
            login() {
                this.form.post('/login', {
                    onSuccess: response => window.location = response.data.path || '/home';
                });
            },
        },
    };
</script>
```

Formlink uses **axios** to make requests to the backend server, hence custom **axios** instances can also be specified. A form may be submitted using the `post`, `put`, or `delete` methods. All of the data specified during the form's creation will be automatically included in the request. In addition, request headers may also be specified:

```javascript
import axios from 'axios';

axios.defaults.withCredentials = true;

export default {
    data() {
        return {
            customAxios: axios,

            form: this.$form({
                name: this.name,
                email: this.email,
            }, {
                resetOnSuccess: true,
            }),

            token: 'my-api-token',
        };
    },

    methods: {
        updateProfile() {
            this.form.useAxios(this.customAxios);

            this.form.post('/user/profile', {
                headers: { Authorization: `Bearer ${this.token}` },
            });
        },
    },
};
```

Form error messages may be accessed using the `form.error` method. This method will return the first available error message for the given field:

```html
<span v-show="form.hasError('email')" v-text="form.error('email')"></span>
```

A flattened list of all validation errors may be accessed using the `errors` method. This method may prove useful when attempting to display the error message in a simple list:

```html
<li v-for="error in form.errors()">{{ error }}</li>
```

By default Formlink "records" the error messages of each input field from the response recieved from the application backend through the `onFail` method. To receive error messages for each input field, error messages should be sent as **response data** from the backend of your application. Error response body should be properly structured for each input field and encased within `data.errors` object:

```json
{
    "data": {
        "errors": {
            "email": "The email you provided already exists.",
            "name": "The name field is required"
        }
    }
}
```

Additional information about the form's current state is available via the `recentlySuccessful` and `processing` methods. These methods help dictate "disabled" or "in progress" UI states:

```html
<span :on="form.recentlySuccessful">Saved.</span>

<button :class="{ 'opacity-25': form.processing }" :disabled="form.processing">Save</button>
```

### Uploading files via POST, PUT, or PATCH request

To upload files via Form Object please specify which method is to be used via Form Object data and use a `POST` request to make the actual request:

```javascript
export default {
    data() {
        return {
            form: this.$form({
                _method: 'PUT',
                name: null,
                email: null,
                photo: null,
            }, {
                resetOnSuccess: false,
            }),
        };
    },

    methods: {
        updateProfile() {
            if (this.$refs.photo) {
                this.form.photo = this.$refs.photo.files[0];
            }

            this.form.post('/user/profile');
        },
    },
};
```

### API & Available Methods

Formlink has several methods that are available for use on your application front.

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
 * Get all the errors associated with the form in a flat array.
 *
 * @return  {String}
 */
errors();

/**
 * Set custom axios instance.
 *
 * @param   {Axios}  axios
 *
 * @return  {void}
 */
useAxios(axios);

/**
 * Save current data to initials object and empty current data registry.
 *
 * @return  {void}
 */
reset();
```

Formlink form object class comes with two default options `resetOnSuccess` which resets all errors and currently bound form data to null. Currently set data will be saved to the `initials` object. And `setInitialOnSuccess` which saves previously set data to the `initials` object.

## Contributing

Please read [CONTRIBUTING.md](https://github.com/Thavarshan/formlink/blob/main/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

-   **Thavarshan Thayananthajothy** - _Initial work_ - [Thavarshan](https://github.com/Thavarshan)

See also the list of [contributors](https://github.com/Thavarshan/formlink/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/Thavarshan/formlink/blob/main/LICENSE) file for details
