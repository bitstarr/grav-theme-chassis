import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminSvgo from 'imagemin-svgo';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminZopfli from 'imagemin-zopfli';

import glob from 'glob';
import path from 'path';
import fs from 'fs';
import { mkdirp } from 'mkdirp'
import chalk from 'chalk';
import prettyBytes from 'pretty-bytes';

const config = {
    src: process.env.npm_package_config_img, // provided by package.json
    dist: process.env.npm_package_config_imgDist, // provided by package.json
    options: {
        plugins: [
            imageminMozjpeg(),
            imageminPngquant({
                // quality: [0.8, 0.95]
            }),
            imageminSvgo({
                js2svg: {
                    pretty: true
                },
                plugins: [
                    'preset-default',
                    {
                        name: 'removeViewBox',
                        active: false,
                    },
                    {
                        name: 'collapseGroups',
                        active: true,
                    },
                    {
                        name: 'removeUselessStrokeAndFill',
                        active: false,
                    },
                    {
                        name: 'removeAttrs',
                        params: {
                            attrs: [
                                'svg:*:preserve',
                                'data.*',
                                'aria.*',
                                'focusable',
                                'id',
                            ]
                        }
                    },
                ]
            }),
            imageminGifsicle({
                optimizationLevel: 2,
            }),
            imageminZopfli({
                more: true,
                // iterations: 50 // very slow but more effective
            }),
        ],
    },
};


const cwd = path.resolve( config.src );

await glob( '**/*.{jpg,gif,png,svg}', { cwd: cwd } ).then( files =>
{
    console.log( chalk.magenta( 'Optimizing Images' ), '\n' );

    let totalBytes = 0;
    let totalSavedBytes = 0;
    let totalFiles = 0;
    let stack = [];

    files.forEach( ( file ) =>
    {
        //console.log( file, fs.statSync(file).size );
        file = {
            name: file,
            content: fs.readFileSync( path.join( cwd, file ) ),
        };

        stack[stack.length] = imagemin.buffer( file.content, config.options )
            .then( data =>
            {
                const originalSize = file.content.length;
                const optimizedSize = data.length;
                const saved = originalSize - optimizedSize;
                const percent = originalSize > 0 ? (saved / originalSize) * 100 : 0;
                const savedMsg = chalk.green( `saved ${prettyBytes(saved)} - ${percent.toFixed(1).replace(/\.0$/, '')}%` );
                const msg = saved > 0 ? savedMsg : chalk.yellow( 'already optimized' );

                if ( saved > 0 ) {
                    totalBytes += originalSize;
                    totalSavedBytes += saved;
                    totalFiles++;
                }

                mkdirp.sync( path.dirname( config.dist + file.name ) );
                fs.writeFileSync( config.dist + file.name, data );
                console.log( chalk.whiteBright( file.name ) + ': ' + msg);
            })
            .catch(error => {
                console.warn( error );
            });
    });

    function report() {
        if ( totalFiles > 0 )
        {
            const percent = totalBytes > 0 ? ( totalSavedBytes / totalBytes ) * 100 : 0;
            let msg = `Minified ${totalFiles} files`;
            msg += `, saved ${prettyBytes( totalSavedBytes )} - ${percent.toFixed(1).replace(/\.0$/, '')}%`;
            console.log( '\n', chalk.green( msg ) );
        }
    }

    Promise.all( stack )
        .then( report );
})
.catch( error => {
    console.warn( error );
});
