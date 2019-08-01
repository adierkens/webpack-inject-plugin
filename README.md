# webpack-inject-plugin

[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors)
[![CircleCI](https://circleci.com/gh/adierkens/webpack-inject-plugin/tree/master.svg?style=svg)](https://circleci.com/gh/adierkens/webpack-inject-plugin/tree/master) [![npm version](https://badge.fury.io/js/webpack-inject-plugin.svg)](https://badge.fury.io/js/webpack-inject-plugin) [![npm](https://img.shields.io/npm/dt/webpack-inject-plugin.svg)](https://www.npmjs.com/package/webpack-inject-plugin) [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo) [![codecov](https://codecov.io/gh/adierkens/webpack-inject-plugin/branch/master/graph/badge.svg)](https://codecov.io/gh/adierkens/webpack-inject-plugin)

A webpack plugin to dynamically inject code into the bundle.

You can check out an example [here](./example)

## Usage

```javascript
# webpack.config.js

const InjectPlugin = require('webpack-inject-plugin').default;


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

You can either return the raw content to load, or a `Promise` which resolves to the content, if you wish to be async.


### options

You can also pass in more options:

```javascript
import InjectPlugin, { ENTRY_ORDER } from 'webpack-inject-plugin';

new InjectPlugin(loader, {
    entryName: 'entry name',         //  Limit the injected code to only the entry w/ this name
    entryOrder: ENTRY_ORDER.First    //  Make the injected code be the first entry point
                ENTRY_ORDER.Last     //  Make the injected code be the last entry point
                ENTRY_ORDER.NotLast  //  Make the injected code be second to last. (The last entry module is the API of the bundle. Useful when you don't want to override that.) This is the default.
});
```

### options.entryName

> `string` | `function`

A filter for which entries to inject code into.
If a `string`, only an entry with the same name will be used.
If a `function`, it will be called with each entry name -- and only inject code for each _truthy_ response

ex.

```javascript
new InjectPlugin(loader, {
  // This will inject code into every entry that's not named `foo`
  entryName: key => key !== 'foo'
});
```

### options.loaderID

> `string`

An optional uniquie ID for the injected loader. If omitted, one will automatically be generated for you. 

## Additional Use Cases

Though this could be used as a standalone plugin, you could also use it to create other webpack plugins, such as injecting code into the build based on a config file.

Example:

```javascript
import InjectPlugin from 'webpack-inject-plugin';

function customLoader(options) {
  return () => {
    return "console.log('My custom code generated from `options`');";
  };
}

export default class MyPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    new InjectPlugin(customLoader(this.options)).apply(compiler);
  }
}
```

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars1.githubusercontent.com/u/13004162?v=4" width="100px;" alt="Adam Dierkens"/><br /><sub><b>Adam Dierkens</b></sub>](https://adamdierkens.com)<br />[💻](https://github.com/adierkens/webpack-inject-plugin/commits?author=adierkens "Code") | [<img src="https://avatars1.githubusercontent.com/u/1654019?v=4" width="100px;" alt="YellowKirby"/><br /><sub><b>YellowKirby</b></sub>](https://github.com/YellowKirby)<br />[💻](https://github.com/adierkens/webpack-inject-plugin/commits?author=YellowKirby "Code") | [<img src="https://avatars2.githubusercontent.com/u/5383506?v=4" width="100px;" alt="Chvin"/><br /><sub><b>Chvin</b></sub>](https://github.com/chvin)<br />[💻](https://github.com/adierkens/webpack-inject-plugin/commits?author=chvin "Code") |
| :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!
