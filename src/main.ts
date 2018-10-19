import { Compiler, Entry, EntryFunc } from 'webpack';
import path from 'path';

type EntryType = string | string[] | Entry | EntryFunc;

const FAKE_MODULE_NAME = 'webpack-inject-plugin.module.js';
const FAKE_LOADER_NAME = 'webpack-inject-plugin.loader.js';

export type Loader = () => string;

let ID = 1;

export const registry: {
  [key: string]: Loader;
} = {};

function getUniqueID() {
  return `webpack-inject-module-${++ID}`;
}

export const enum ENTRY_ORDER {
  First,
  Last,
  NotLast
}

export interface IInjectOptions {
  entryName?: string;
  entryOrder?: ENTRY_ORDER;
}

function injectToArray(
  originalEntry: string[],
  newEntry: string,
  entryOrder = ENTRY_ORDER.NotLast
): string[] {
  if (entryOrder === ENTRY_ORDER.First) {
    return [newEntry, ...originalEntry];
  }

  if (entryOrder === ENTRY_ORDER.Last) {
    return [...originalEntry, newEntry];
  }

  return [
    ...originalEntry.splice(0, originalEntry.length - 1),
    newEntry,
    ...originalEntry.splice(originalEntry.length - 1)
  ];
}

export function injectEntry(
  originalEntry: EntryType | undefined,
  newEntry: string,
  options: IInjectOptions
): EntryType {
  if (originalEntry === undefined) {
    return newEntry;
  }

  // Last module in an array gets exported, so the injected one must not be
  // last. https://webpack.github.io/docs/configuration.html#entry

  if (typeof originalEntry === 'string') {
    return injectToArray([originalEntry], newEntry, options.entryOrder);
  }

  if (Array.isArray(originalEntry)) {
    return injectToArray(originalEntry, newEntry, options.entryOrder);
  }

  if (originalEntry === Object(originalEntry)) {
    return Object.entries(originalEntry).reduce(
      (a: { [key: string]: EntryType }, [key, entry]) => {
        if (
          !options.entryName ||
          (options.entryName && options.entryName === key)
        ) {
          a[key] = injectEntry(entry, newEntry, options);
        } else {
          a[key] = entry;
        }
        return a;
      },
      {}
    );
  }

  return originalEntry;
}

export default class WebpackInjectPlugin {
  private readonly options: IInjectOptions;
  private readonly loader: Loader;

  constructor(loader: Loader, options?: IInjectOptions) {
    this.loader = loader;
    this.options = {
      entryName: (options && options.entryName) || undefined,
      entryOrder: (options && options.entryOrder) || ENTRY_ORDER.NotLast
    };
  }

  apply(compiler: Compiler) {
    const moduleLocation = path.join(__dirname, FAKE_MODULE_NAME);

    const id = getUniqueID();
    registry[id] = this.loader;

    compiler.options.entry = injectEntry(
      compiler.options.entry,
      moduleLocation,
      this.options
    );

    if (compiler.options.module === undefined) {
      compiler.options.module = {
        rules: []
      };
    }

    if (compiler.options.module.rules === undefined) {
      compiler.options.module.rules = [];
    }

    compiler.options.module.rules.push({
      test: /webpack-inject-plugin\.module\.js/,
      use: [
        {
          loader: path.join(__dirname, FAKE_LOADER_NAME),
          query: { id }
        }
      ]
    });
  }
}
