import path from 'path';
import _ from 'lodash';

const FAKE_MODULE_NAME = 'webpack-inject-plugin.module.js';
const FAKE_LOADER_NAME = 'webpack-inject-plugin.loader.js';

export const ENTRY_ORDER = {
  First: 'first',
  Last: 'last',
  NotLast: 'notLast'
};

function injectToArray(originalEntry, newEntry, entryOrder = 'notLast') {
  if (!_.isArray(originalEntry)) {
    throw new TypeError('Expected entry to be an array');
  }

  if (entryOrder === ENTRY_ORDER.First) {
    return [newEntry, ...originalEntry];
  } else if (entryOrder === ENTRY_ORDER.Last) {
    return [...originalEntry, newEntry];
  }
  return [...originalEntry.splice(0, originalEntry.length - 1), newEntry, ...originalEntry.splice(originalEntry.length - 1)];
}

export function injectEntry(originalEntry, newEntry, options = {}) {
  const {entryName, entryOrder} = options;

  // Last module in an array gets exported, so the injected one must not be
  // last. https://webpack.github.io/docs/configuration.html#entry

  if (_.isArray(originalEntry)) {
    return injectToArray(originalEntry, newEntry, entryOrder);
  }

  if (_.isObject(originalEntry)) {
    if (entryName) {
      return {
        ...originalEntry,
        [entryName]: injectEntry(originalEntry[entryName], newEntry)
      };
    }
    return _.mapValues(originalEntry, _.partial(injectEntry, _, newEntry));
  }

  if (_.isString(originalEntry)) {
    return injectToArray([originalEntry], newEntry, entryOrder);
  }

  return newEntry;
}

export const registry = {};

export default class WebpackInjectPlugin {

  constructor(loader, options = {}) {
    this.loader = _.isFunction(loader) ? loader : _.noop;
    this.options = options;
  }

  apply(compiler) {
    const moduleLocation = path.join(__dirname, FAKE_MODULE_NAME);

    const id = _.uniq();

    registry[id] = this.loader;

    // Append an entry for our fake module
    compiler.options.entry = injectEntry(compiler.options.entry, moduleLocation, {
      entryName: this.options.entry,
      entryOrder: this.options.order
    });

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
