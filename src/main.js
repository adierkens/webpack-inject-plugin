import path from 'path';
import _ from 'lodash';

const FAKE_MODULE_NAME = 'webpack-inject-plugin.module.js';
const FAKE_LOADER_NAME = 'webpack-inject-plugin.loader.js';

export function appendEntry(originalEntry, newEntry) {
  if (_.isArray(originalEntry)) {
    return [...originalEntry, newEntry];
  }

  if (_.isObject(originalEntry)) {
    return _.mapValues(originalEntry, _.partial(appendEntry, _, newEntry));
  }

  if (_.isString(originalEntry)) {
    return [originalEntry, newEntry];
  }

  return newEntry;
}

export const registry = {};

export default class WebpackInjectPlugin {

  constructor(loader) {
    this.loader = _.isFunction(loader) ? loader : _.noop;
  }

  apply(compiler) {
    const moduleLocation = path.join(__dirname, FAKE_MODULE_NAME);

    const id = _.uniq();

    registry[id] = this.loader;

    // Append an entry for our fake module
    compiler.options.entry = appendEntry(compiler.options.entry, moduleLocation);

    // Add a loader for our fake module
    // The loader will be responsible for injecting the code for us
    if (_.isUndefined(compiler.options.module)) {
      compiler.options.module = {};
    }

    if (_.isUndefined(compiler.options.module.rules)) {
      compiler.options.module.rules = [];
    }

    compiler.options.module.rules.push({
      test: /webpack-inject-plugin\.module\.js$/,
      use: [{
        loader: path.resolve(__dirname, FAKE_LOADER_NAME),
        query: {id}
      }]
    });
  }

}
