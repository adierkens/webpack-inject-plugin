import test from 'ava';
import {appendEntry} from '../main';

test('appends to the entry config correctly', t => {
	t.is(appendEntry(undefined, 'foo'), 'foo');
});
