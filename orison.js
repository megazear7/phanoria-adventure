const { OrisonGenerator, OrisonServer, OrisonStaticServer } = require('orison');

if (process.argv.includes('build'))
  new OrisonGenerator({ rootPath: __dirname, stripHtml: true }).build();

if (process.argv.includes('serve'))
  new OrisonServer({ rootPath: __dirname, stripHtml: true }).start();

if (process.argv.includes('static'))
  new OrisonStaticServer({ rootPath: __dirname, stripHtml: true }).start();