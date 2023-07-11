'use strict';

// Load plugins
const { gulp, series, parallel, dest, src, watch } = require('gulp');
const plumber = require( 'gulp-plumber' );
const sourcemaps = require( 'gulp-sourcemaps' );

const newer = require( 'gulp-newer' );
const imagemin = require( 'gulp-imagemin' );
const imageminMozjpeg = require( 'imagemin-mozjpeg' );
const imageminPngquant = require( 'imagemin-pngquant' );
const imageminZopfli = require( 'imagemin-zopfli' );
const imageminGiflossy = require( 'imagemin-giflossy' );

const concat = require( 'gulp-concat' );
const uglify = require( 'gulp-terser' );

const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssimport = require('postcss-easy-import');
const nesting = require('postcss-nested');
const mediaVariables = require('postcss-media-variables');
const cssnano = require( 'gulp-cssnano' );

const browserSync = require( 'browser-sync' ).create();

const del = require( 'del' );
const glob = require( 'glob' );
const path = require( 'path' );

const master = require( './package.json' );
const jsBundles = glob.sync( master.config.js + '*.json' );

const config = {

    img: {
        src: master.config.img, // provided by package.json'
        pattern: '**/*.{png,jpg,gif,svg,webp,ico}',
        dist: master.config.imgDist, // provided by package.json
    },
    icons: {
        src: master.config.icons, // provided by package.json'
        pattern: '**/*.svg',
        dist: master.config.iconsDist, // provided by package.json
    },

    jsmin: {
        mangle: {
            reserved: ['_mtm', 'uuid'],
        }
    },

    /* parameters for image optimization */
    imagemin: [
        imageminMozjpeg( {
            //quality: 85
        }),
        imageminPngquant( {
            speed: 3,
            quality: [0.95, 1] //lossy settings
        }),
        imageminZopfli( {
            more: true
            // iterations: 50 // very slow but more effective
        }),
        //gif
        // imagemin.gifsicle({
        //     interlaced: true,
        //     optimizationLevel: 3
        // }),
        //gif very light lossy, use only one of gifsicle or Giflossy
        imageminGiflossy( {
            optimizationLevel: 3,
            optimize: 3, //keep-empty: Preserve empty transparent frames
            lossy: 2
        }),
        imagemin.svgo( {
            js2svg: {
                pretty: true
            },
            plugins: [
                {
                    removeViewBox: false,
                    collapseGroups: true,
                    removeUselessStrokeAndFill: false,
                }
            ]
        })
    ],

    postcss: [
        cssimport,
        // mediaVariables(),
        nesting(),
        autoprefixer(),
    ],

    browsersync:{
        files: master.config.assets,
        proxy: master.config.bsProxy,
        port: 3000,
        open: false,
    }
};


/* CSS Tasks
-------------------------------------------------------------------- */
function cssDev() {
    return src( [ master.config.css + '*.css', master.config.css + 'page/*.css' ] )
        .pipe( plumber( { errorHandler: onError } ) )
        .pipe( sourcemaps.init() )
        .pipe( postcss( config.postcss ) )
        .pipe( sourcemaps.write('.') )
        .pipe( dest( master.config.cssDist ) )
        .pipe( browserSync.stream( { match: '**/*.css' } ) );
}

function cssBuild() {
    return src( [ master.config.css + '*.css', master.config.css + 'page/*.css' ] )
        .pipe( plumber( { errorHandler: onError } ) )
        .pipe( postcss( config.postcss ) )
        .pipe( cssnano( { zindex: false } ) )
        .pipe( dest( master.config.cssDist ) );
}

function cssFonts() {
    return src( master.config.fonts + '*.{woff,woff2}' )
        .pipe( newer( master.config.fontsDist ) )
        .pipe( dest( master.config.fontsDist ) );
}


/* Image Tasks
-------------------------------------------------------------------- */
function optimizeImages() {
    return src( config.img.src + config.img.pattern )
        .pipe( newer( config.img.dist ) )
        .pipe( imagemin( config.imagemin, { verbose: true } ) )
        .pipe( dest( config.img.dist ) );
}

function optimizeIcons() {
    return src( [ config.icons.src + config.icons.pattern ] )
        .pipe( newer( config.icons.dist ) )
        .pipe( imagemin( config.imagemin, { verbose: true } ) )
        .pipe( dest( config.icons.dist ) );
}

function sloppyImages() {
    return src( config.img.src + config.img.pattern )
        .pipe( newer( config.img.dist ) )
        .pipe( dest( config.img.dist ) );
}

function optimizeFavicons() {
    return src( master.config.favicons + '*' )
        .pipe( newer( master.config.faviconsDist ) )
        .pipe( imagemin( config.imagemin, { verbose: true } ) )
        .pipe( dest( master.config.faviconsDist ) );
}


/* JavaScript Tasks
-------------------------------------------------------------------- */
function sloppyScripts() {
    return src( master.config.js + '*.js' )
        .pipe( newer( master.config.jsDist ) )
        .pipe( dest( master.config.jsDist ) );
}

function bundle2js(done) {
    // @see https://stackoverflow.com/a/56920867/1557696
    jsBundles.forEach( function( bundle ) {
        let array2concat = [];

        const concatName = path.format({
            name: path.basename( bundle, '.json' ),
            ext: '.js'
        });
        // concatName = 'bundle1.js', 'bumdle2.js', etc.
        const thisFile = require( path.join( __dirname, bundle ) );  // get and parse each _bundle<n>.json

        // build the array for gulp.src from each key in the bundle.json's
        // if more than the two specified keys ('lib' and 'src') just loop through them all
        // with the array returned from Objeect.keys(thisFile);

        thisFile.lib.forEach( function( item ) { array2concat.push( path.join( '.', 'node_modules', item ) ); } );
        thisFile.src.forEach( function( item ) { array2concat.push( path.join( master.config.jsSrc, item ) ); } );

        return src( array2concat )
            .pipe( concat( concatName ) )
            .pipe( dest( master.config.jsDist ) );
    });
    done();
}

function jsmin() {
    return src( master.config.jsDist  + '*.js' )
        .pipe( plumber() )
        .pipe( uglify( config.jsmin ) )
        .pipe( dest( master.config.jsDist) );
}


/* Watch + Sync
-------------------------------------------------------------------- */
// BrowserSync
function browserSyncServer( done ) {
    browserSync.init( config.browsersync );
    done();
}

// BrowserSync Reload
function browserSyncReload( done ) {
    browserSync.reload();
    done();
}

// Watch files
function watchFiles() {
    watch( master.config.css + '**/*', cssDev );
    watch( master.config.js + '**/*', series( bundle2js, sloppyScripts, browserSyncReload ) );
    watch( config.img.src + config.img.pattern, series( sloppyImages, browserSyncReload ) );
    watch( config.icons.src + config.icons.pattern, series( optimizeIcons, browserSyncReload ) );
}


/* Utility Tasks
-------------------------------------------------------------------- */
// Clean assets
function clean() {
    return del( [ master.config.dist + '/*' ] );
}

const onError = err => {
    console.log( '\x1b[41mError\x1b[0m' + ' ' + err.toString() );
    this.emit( 'end' );
};


/* Export Tasks
-------------------------------------------------------------------- */
exports.clean = clean;

exports.images = optimizeImages;
exports.icons = optimizeIcons;
exports.sloppyImg = sloppyImages;
exports.imagemin = parallel(
    optimizeImages,
    optimizeIcons
);
exports.favicons = optimizeFavicons;

exports.css = cssDev;
exports.cssmin = cssBuild;
exports.fonts = cssFonts;

exports.js = parallel(
    bundle2js,
    sloppyScripts
);
exports.jsmin = jsmin;



exports.watch = parallel(
    watchFiles,
    browserSyncServer
);

exports.dev = series(
    parallel(
        sloppyImages,
        optimizeIcons,
        exports.css,
        exports.js
    )
);

exports.build = series(
    clean,
    parallel(
        exports.imagemin,
        exports.cssmin,
        exports.js,
        exports.fonts
    ),
    exports.jsmin
);

exports.default = watch;
