import imagemin from 'imagemin';
import imageminSvgo from 'imagemin-svgo';

import glob from 'glob';
import path from 'path';
import fs from 'fs';
import { mkdirp } from 'mkdirp'
import chalk from 'chalk';
import prettyBytes from 'pretty-bytes';

const config = {
    src: process.env.npm_package_config_icons, // provided by package.json
    dist: process.env.npm_package_config_iconsDist, // provided by package.json
    options: {
        plugins: [
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
                        name: 'removeDimensions',
                        active: true,
                    },
                    {
                        name: 'convertStyleToAttrs',
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
                                'class',
                                'data.*',
                                'aria.*',
                                'focusable',
                                'id',
                            ]
                        }
                    },
                ]
            }),
        ],
    },
};


const cwd = path.resolve( config.src );

await glob( '**/*.svg', { cwd: cwd } ).then( files =>
{
    console.log( chalk.magenta( 'Optimizing Icons' ), '\n' );

    let totalBytes = 0;
    let totalSavedBytes = 0;
    let totalFiles = 0;
    let stack = [];

    files.forEach( ( file ) =>
    {
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
.catch(error => {
    console.warn( error );
});
