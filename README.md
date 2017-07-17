# webpack-inject-plugin [![Build Status](https://travis-ci.org/adierkens/webpack-inject-plugin.svg?branch=master)](https://travis-ci.org/adierkens/webpack-inject-plugin) 
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
