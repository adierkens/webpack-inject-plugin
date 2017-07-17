import _ from 'lodash';
import loaderUtils from 'loader-utils';
import {registry} from './main';

export default function (source) {
  const options = loaderUtils.getOptions(this);

  let func = _.noop;

  if (registry[options.id]) {
    func = registry[options.id];
  }

  return func(source);
}
