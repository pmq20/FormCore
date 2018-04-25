const fs = require('fs');
const path = require('path');

const alias = {};
fs.readdirSync(path.resolve(__dirname, 'src/')).forEach(file => {
  alias[path.basename(file, '.js')] = path.resolve(__dirname, `src/${file}/`);
});

export default {
  entry: 'src/Home/index.js',
  extraBabelPlugins: [
    'transform-decorators-legacy',
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
  ],
  alias: alias,
  ignoreMomentLocale: true,
  theme: './src/Home/theme.js',
  html: {
    template: './src/Home/index.ejs',
  },
  publicPath: '/',
  disableDynamicImport: true,
  hash: false,
};
