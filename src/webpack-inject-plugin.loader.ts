import loaderUtils from 'loader-utils';
import { loader } from 'webpack';
import { registry, Loader } from './main';

const injectLoader: loader.Loader = function(source: string | Buffer) {
  const options = loaderUtils.getOptions(this);

  let func: Loader = () => '';
  if (registry[options.id]) {
    func = registry[options.id];
  }

  const rtn: string | Promise<string> = func.call(this, source);

  if (rtn instanceof Promise) {
    const callback = this.async();
    rtn
      .then(result => {
        callback && callback(null, result);
      })
      .catch(err => {
        callback && callback(err, undefined);
      });
    return undefined;
  }

  return rtn;
};

export default injectLoader;
