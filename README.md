# webpack-inject-plugin [![Build Status](https://travis-ci.org/adierkens/webpack-inject-plugin.svg?branch=master)](https://travis-ci.org/adierkens/webpack-inject-plugin) [![npm version](https://badge.fury.io/js/webpack-inject-plugin.svg)](https://badge.fury.io/js/webpack-inject-plugin)
A webpack plugin to dynamically inject code into the bundle.

## Usage

```javascript
# webpack.config.js

const InjectPlugin = require('webpack-inject-plugin');


module.exports = {
    // Other stuff in your webpack config

    plugins: [
        new InjectPlugin(function() {
            return "console.log('Hello World');"
        });
    ]
};
```

This webpack plugin accepts a single argument, a function to which returns the code to inject into the bundle.

The function is called using the same context as the loader, so everything [here](https://webpack.js.org/api/loaders/#the-loader-context) applies.


### options
You can also pass in more options:

```javascript
import InjectPlugin, { ENTRY_ORDER } from 'webpack-inject-plugin';

new InjectPlugin(loader, {
    entry: 'entry name',         //  Limit the injected code to only the entry w/ this name
    order:  ENTRY_ORDER.First    //  Make the injected code be the first entry point
            ENTRY_ORDER.Last     //  Make the injected code be the last entry point
            ENTRY_ORDER.NotLast  //  Make the injected code be second to last. (The last entry module is the API of the bundle. Useful when you don't want to override that.) This is the default.
});

```

You can either return the raw content to load, or a `Promise` which resolves to the content, if you wish to be async.

Though this could be used as a standalone plugin, you could also use it to create other webpack plugins, such as injecting code into the build based on a config file.

Example:
```javascript
import InjectPlugin from 'webpack-inject-plugin';

function customLoader(options) {
    return () => {
        return "console.log('My custom code generated from `options`');"
    }
}

export default class MyPlugin {
    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        compiler.apply(new InjectPlugin(customLoader(this.options)));
    }
}
```
