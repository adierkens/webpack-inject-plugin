import _ from 'lodash';
import loaderUtils from 'loader-utils';
import {registry} from './main';

export default function (source) {
  const options = loaderUtils.getOptions(this);

  let func = _.noop;

  if (registry[options.id]) {
    func = registry[options.id];
  }

  const rtn = func.call(this, source);

  if (rtn instanceof Promise) {
    const callback = this.async();
    rtn.then((result, err) => {
      callback(err, result);
    });
  }

  return rtn;
}
