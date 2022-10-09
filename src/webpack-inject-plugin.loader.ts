import { registry } from './main';

const injectLoader = function(source: string | Buffer) {
  const options = this.getOptions();
  let func = (arg: any) => '';
  if (registry[options.id]) {
    func = registry[options.id];
  }

  const rtn: any = func.call(this, source);

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
