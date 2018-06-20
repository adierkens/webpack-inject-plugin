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

test('appends to only the specified entry', t => {
  t.is(injectEntry(undefined, 'foo', {entryName: 'bar'}), 'foo');
  t.deepEqual(injectEntry({
    foo: 'bar',
    bar: 'baz'
  }, 'added', {entryName: 'bar'}), {
    foo: 'bar',
    bar: ['added', 'baz']
  });
});

test('respects config for order', t => {
  t.deepEqual(injectEntry([
    'foo',
    'bar'
  ], 'baz', {entryOrder: 'first'}), [
    'baz',
    'foo',
    'bar'
  ]);

  t.deepEqual(injectEntry([
    'foo',
    'bar'
  ], 'baz', {entryOrder: 'last'}), [
    'foo',
    'bar',
    'baz'
  ]);

  t.deepEqual(injectEntry([
    'foo',
    'bar'
  ], 'baz', {entryOrder: 'notLast'}), [
    'foo',
    'baz',
    'bar'
  ]);
});

test('order config for strings', t => {
  t.deepEqual(injectEntry('original', 'new', {entryOrder: 'first'}), ['new', 'original']);
  t.deepEqual(injectEntry('original', 'new', {entryOrder: 'last'}), ['original', 'new']);
  t.deepEqual(injectEntry('original', 'new', {entryOrder: 'notLast'}), ['new', 'original']);
});
