# Preflight JS

Convenient JavaScript library that helps with sending form data through HTTP requests by serializing Objects to FormData instances.

## Install

You can install Preflight JS using Node JS package manager.

```sh
npm install preflight-js
```

Or add it directly to your `package.json` file:

```json
"dependencies": {
  "preflight-js": "1.3.1"
}
```

## Usage

Shown below is an example of using Prefligh JS in Vanilla JavaScript.

```javascript
import Form from 'preflight-js';

const form = new Form({
    email: null,
    password: null
});

function login() {
    form.post('/login)
        .then(response => {
            if (! form.hasErrors()) {
                window.location = '/home';
            }
        });
}
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
    }

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
                <input type="email" v-model="form.email">
            </label>

            <div v-show="form.error('email')">
                <span>{{ form.error('email') }}</span>
            </div>
        </div>

        <div>
            <label>
                <span>Password</span>
                <input type="password" v-model="form.password">
            </label>

            <div v-show="form.error('password')">
                <span>{{ form.error('password') }}</span>
            </div>
        </div>

        <div>
            <button type="submit">Login</button>
        </div>
    </form>
</template>
```
