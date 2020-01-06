import { EntryFunc } from 'webpack';
import { injectEntry, ENTRY_ORDER } from '../main';

describe('injectEntry', () => {
  it('appends to the entry config correctly', () => {
    expect(injectEntry(undefined, 'foo', {})).toEqual('foo');
    expect(injectEntry(['original'], 'added', {})).toEqual([
      'added',
      'original'
    ]);
    expect(injectEntry('original', 'added', {})).toEqual(['added', 'original']);
    expect(injectEntry(['foo', 'bar'], 'baz', {})).toEqual([
      'foo',
      'baz',
      'bar'
    ]);
    expect(injectEntry(['foo', 'bar', 'baz', 'blah'], 'aaa', {})).toEqual([
      'foo',
      'bar',
      'baz',
      'aaa',
      'blah'
    ]);
    expect(
      injectEntry(
        {
          foo: 'bar',
          another: ['an', 'array']
        },
        'added',
        {}
      )
    ).toEqual({
      foo: ['added', 'bar'],
      another: ['an', 'added', 'array']
    });

    // This dynamic entry function will return {foo: bar} on first call, then {foo: baz} on the next call
    let first = true;
    const entryFunc = injectEntry(
      async () => {
        return { foo: first ? 'bar' : 'baz' };
      },
      'added',
      {}
    ) as EntryFunc;

    expect(entryFunc()).resolves.toEqual({ foo: ['added', 'bar'] });
    first = false;
    expect(entryFunc()).resolves.toEqual({ foo: ['added', 'baz'] });
  });

  it('appends to only the specified entry', () => {
    expect(injectEntry(undefined, 'foo', { entryName: 'bar' })).toBe('foo');
    expect(
      injectEntry({ foo: 'bar', bar: 'baz' }, 'added', { entryName: 'bar' })
    ).toEqual({
      foo: 'bar',
      bar: ['added', 'baz']
    });
  });

  it('supports a filter function', () => {
    expect(
      injectEntry({ foo: 'bar', bar: 'baz', baz: 'blah' }, 'added', {
        entryName: e => e !== 'bar'
      })
    ).toEqual({
      foo: ['added', 'bar'],
      bar: 'baz',
      baz: ['added', 'blah']
    });
  });

  it('throws error for unknown filter type', () => {
    expect(() => {
      injectEntry('bar', 'foo', {
        entryName: { not: 'a function ' } as any
      });
    }).toThrowError();
  });

  it('respects the config for ordering', () => {
    expect(
      injectEntry(['foo', 'bar'], 'baz', { entryOrder: ENTRY_ORDER.First })
    ).toEqual(['baz', 'foo', 'bar']);
    expect(
      injectEntry(['foo', 'bar'], 'baz', { entryOrder: ENTRY_ORDER.Last })
    ).toEqual(['foo', 'bar', 'baz']);
    expect(
      injectEntry(['foo', 'bar'], 'baz', { entryOrder: ENTRY_ORDER.NotLast })
    ).toEqual(['foo', 'baz', 'bar']);
  });

  it('order config for strings', () => {
    expect(
      injectEntry('original', 'new', { entryOrder: ENTRY_ORDER.First })
    ).toEqual(['new', 'original']);
    expect(
      injectEntry('original', 'new', { entryOrder: ENTRY_ORDER.Last })
    ).toEqual(['original', 'new']);
    expect(
      injectEntry('original', 'new', { entryOrder: ENTRY_ORDER.NotLast })
    ).toEqual(['new', 'original']);
  });
});
