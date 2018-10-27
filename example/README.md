A small sample project to show off `webpack-inject-plugin` in action.


- Run `webpack` in this directory

- Inspect `dist/main.js` for the:
```javascript
console.log('hello world');
``` 
statement at the end of the bundle: 

```bash
cat dist/main.js | grep 'console'
```
