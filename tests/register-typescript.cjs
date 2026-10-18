const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const resolve = Module._resolveFilename;
Module._resolveFilename = function (name, ...args) {
  return resolve.call(this, name.startsWith('@/') ? path.join(root, name.slice(2)) : name, ...args);
};
const compile = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, filename);
require.extensions['.ts'] = compile;
const javascript = require.extensions['.js'];
require.extensions['.js'] = (module, filename) => {
  if (filename.startsWith(root + path.sep) && !filename.includes(`${path.sep}node_modules${path.sep}`)) compile(module, filename);
  else javascript(module, filename);
};
