var browserify = require('browserify'),
    tsify = require('tsify'),
    stringify = require('stringify'),
    fs = require('fs');

let bundle = browserify({ debug: true })
    .transform(stringify, {
        appliesTo: { includeExtensions: ['.html'] },
    })
    .add('./scripts/ts/dynamic-dom/dynamic-dom.ts')
    .add('./scripts/ts/tracker/tracker.ts')
    .plugin(tsify, { noImplicitAny: true })
    .on('error', (err) => {
        this.emit('end');
    });

bundle.pipeline.on('package', (pkg) => console.log('Built: ' + pkg.name));
bundle.bundle().pipe(fs.createWriteStream('./scripts/js/app.js'));
