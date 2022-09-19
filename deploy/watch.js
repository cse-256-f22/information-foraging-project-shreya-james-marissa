// "watchify --debug ./scripts/ts/dynamic-dom/dynamic-dom.ts ./scripts/ts/tracker/tracker.ts -p tsify -v -o ./scripts/js/app.js"
var browserify = require('browserify'),
    tsify = require('tsify'),
    stringify = require('stringify'),
    watchify = require('watchify'),
    fs = require('fs');
const { timeStamp } = require('console');

let bundle = browserify({
    debug: true,
    cache: {},
    packageCache: {},
})
    .plugin(watchify, {
        delay: 100,
        ignoreWatch: [
            '**/node_modules/**',
            '**/deploy/**',
            '**/downloads/**',
            '**/files/**',
            '**/scenarios/**',
            '**/wrappers/**',
        ],
    })
    .transform(stringify, {
        appliesTo: { includeExtensions: ['.html'] },
    })
    .add('./scripts/ts/dynamic-dom/dynamic-dom.ts')
    .add('./scripts/ts/tracker/tracker.ts')
    .plugin(tsify, { noImplicitAny: true })
    .on('error', console.error);

bundle.pipeline.on('package', (pkg) => console.log('Built: ' + pkg.name));

function doBundle() {
    const d = new Date();
    console.error(
        `[${d.getDate()}/${
            d.getMonth() + 1
        }/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}] Rebuilding app. Hang on...`
    );
    const fsws = fs.createWriteStream('./scripts/js/app.js.tmp');
    fsws.on('finish', () =>
        fs.renameSync('./scripts/js/app.js.tmp', './scripts/js/app.js')
    );
    bundle.bundle().pipe(fsws);
}

bundle.on('update', doBundle);
doBundle();
