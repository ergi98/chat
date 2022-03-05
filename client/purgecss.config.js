/* eslint-disable no-undef */
const fs = require('fs');
const { PurgeCSS } = require('purgecss');

new PurgeCSS()
  .purge({
    css: [
      'dist/*.css',
      'node_modules/antd/es/button/**/*.css',
      'node_modules/antd/es/button/**/*.css',
      'node_modules/antd/es/slider/**/*.css',
      'node_modules/antd/es/slider/**/*.css',
      'node_modules/antd/es/image/**/*.css',
      'node_modules/antd/es/image/**/*.css',
      'node_modules/antd/es/icon/**/*.css',
      'node_modules/antd/es/icon/**/*.css',
      'node_modules/antd/es/input/**/*.css',
      'node_modules/antd/es/input/**/*.css',
      'node_modules/antd/es/menu/**/*.css',
      'node_modules/antd/es/menu/**/*.css',
      'node_modules/antd/es/modal/**/*.css',
      'node_modules/antd/es/modal/**/*.css',
      'node_modules/antd/es/spin/**/*.css',
      'node_modules/antd/es/spin/**/*.css',
      'node_modules/antd/es/empty/**/*.css',
      'node_modules/antd/es/empty/**/*.css',
      'node_modules/antd/es/space/**/*.css',
      'node_modules/antd/es/space/**/*.css',
      'node_modules/antd/es/tooltip/**/*.css',
      'node_modules/antd/es/tooltip/**/*.css',
      'node_modules/antd/es/dropdown/**/*.css',
      'node_modules/antd/es/dropdown/**/*.css'
    ],
    content: [
      'dist/*.html',
      'dist/*.js',
      'node_modules/antd/es/button/**/*.js',
      'node_modules/antd/es/button/**/*.ts',
      'node_modules/antd/es/slider/**/*.js',
      'node_modules/antd/es/slider/**/*.ts',
      'node_modules/antd/es/image/**/*.js',
      'node_modules/antd/es/image/**/*.ts',
      'node_modules/antd/es/icon/**/*.js',
      'node_modules/antd/es/icon/**/*.ts',
      'node_modules/antd/es/input/**/*.js',
      'node_modules/antd/es/input/**/*.ts',
      'node_modules/antd/es/menu/**/*.js',
      'node_modules/antd/es/menu/**/*.ts',
      'node_modules/antd/es/modal/**/*.js',
      'node_modules/antd/es/modal/**/*.ts',
      'node_modules/antd/es/spin/**/*.js',
      'node_modules/antd/es/spin/**/*.ts',
      'node_modules/antd/es/empty/**/*.js',
      'node_modules/antd/es/empty/**/*.ts',
      'node_modules/antd/es/space/**/*.js',
      'node_modules/antd/es/space/**/*.ts',
      'node_modules/antd/es/tooltip/**/*.js',
      'node_modules/antd/es/tooltip/**/*.ts',
      'node_modules/antd/es/dropdown/**/*.js',
      'node_modules/antd/es/dropdown/**/*.ts'
    ],
    extractors: [
      {
        extractor: (content) => content.match(/([a-zA-Z-]+)(?= {)/g) || [],
        extensions: ['css']
      }
    ]
  })
  .then(
    (res) => {
      console.log(res);
      res.map((file) => {
        fs.writeFileSync(file.file, file.css, { encoding: 'utf8', flag: 'w' });
        console.log('[X] Writing ' + file.file);
      });
    },
    (err) => console.log(err)
  );
