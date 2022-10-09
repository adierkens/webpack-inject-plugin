import { injectEntry, ENTRY_ORDER } from '../main';

describe('injectEntry', () => {
 
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
