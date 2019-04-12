import { randomBytes } from 'crypto';
import path from 'path';
import { Compiler, Entry, EntryFunc } from 'webpack';

type EntryType = string | string[] | Entry | EntryFunc;
type EntryFilterFunction = (entryName: string) => boolean;
type EntryFilterType = string | EntryFilterFunction;

const FAKE_LOADER_NAME = 'webpack-inject-plugin.loader';

export type Loader = () => string;

export const registry: {
  [key: string]: Loader;
} = {};

function getUniqueID() {
  const id = randomBytes(2).toString('hex');

  return `webpack-inject-module-${id}`;
}

export const enum ENTRY_ORDER {
  First,
  Last,
  NotLast
}

export interface IInjectOptions {
  entryName?: EntryFilterType;
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

function createEntryFilter(
  filterOption?: EntryFilterType
): EntryFilterFunction {
  if (filterOption === null || filterOption === undefined) {
    return () => true;
  }

  if (typeof filterOption === 'string') {
    return (entryName: string) => filterOption === entryName;
  }

  if (typeof filterOption === 'function') {
    return filterOption;
  }

  throw new Error(`Unknown entry filter: ${typeof filterOption}`);
}

export function injectEntry(
  originalEntry: EntryType | undefined,
  newEntry: string,
  options: IInjectOptions
): EntryType {
  if (originalEntry === undefined) {
    return newEntry;
  }

  const filterFunc = createEntryFilter(options.entryName);

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
      (a: Record<string, EntryType>, [key, entry]) => {
        if (filterFunc(key)) {
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
    const id = getUniqueID();
    const newEntry = path.resolve(__dirname, `${FAKE_LOADER_NAME}?id=${id}!`);

    registry[id] = this.loader;

    compiler.options.entry = injectEntry(
      compiler.options.entry,
      newEntry,
      this.options
    );
  }
}
