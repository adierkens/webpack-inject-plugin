import test from 'ava';
import {injectEntry} from '../main';

test('appends to the entry config correctly', t => {
  t.is(injectEntry(undefined, 'foo'), 'foo');
  t.deepEqual(injectEntry(['original'], 'added'), ['added', 'original']);
  t.deepEqual(injectEntry('original', 'added'), ['added', 'original']);
  t.deepEqual(injectEntry({
    foo: 'bar',
    another: ['an', 'array']
  }, 'added'), {
    foo: ['added', 'bar'],
    another: ['added', 'an', 'array']
  });
});
