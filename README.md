# Preflight JS

Convenient JavaScript library that helps with sending form data through HTTP requests by serializing Objects to FormData instances.

## Install

```sh
npm install preflight-js
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
