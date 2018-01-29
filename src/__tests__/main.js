import test from 'ava';
import {injectEntry} from '../main';

test('appends to the entry config correctly', t => {
  t.is(injectEntry(undefined, 'foo'), 'foo');
  t.deepEqual(injectEntry(['original'], 'added'), ['added', 'original']);
  t.deepEqual(injectEntry('original', 'added'), ['added', 'original']);
  t.deepEqual(injectEntry(['foo', 'bar'], 'baz'), ['foo', 'baz', 'bar']);
  t.deepEqual(injectEntry(['foo', 'bar', 'baz', 'blah'], 'aaa'), ['foo', 'bar', 'baz', 'aaa', 'blah']);
  t.deepEqual(injectEntry({
    foo: 'bar',
    another: ['an', 'array']
  }, 'added'), {
    foo: ['added', 'bar'],
    another: ['an', 'added', 'array']
  });
});
