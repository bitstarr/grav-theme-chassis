import glob from 'glob';
import path from 'path';
import fs from 'fs';
import { mkdirp } from 'mkdirp'
import chalk from 'chalk';
import vinyl from 'vinyl';
import SVGSpriter from 'svg-sprite'

const src = process.env.npm_package_config_sprite; // provided by package.json
const config = {
    mode: {
        symbol: {
            dest: process.env.npm_package_config_spriteDist, // provided by package.json
            sprite: 'sprite.svg',
            render: {
                // custom example
                html: {
                    template: src + '_icons.html'
                },
                // php: {
                //     template: src + '_list.html'
                // }
            },
        },
    },
};

const spriter = new SVGSpriter( config );
const cwd = path.resolve( src );

await glob( '**/*.svg', { cwd: cwd } ).then( files =>
{
    console.log( chalk.magenta( 'Creating SVG Icon Sprite' ), '\n' );

    files.forEach( ( file ) =>
    {
        spriter.add( new vinyl({
            path: path.join( cwd, file ),
            base: cwd,
            contents: fs.readFileSync( path.join( cwd, file ) )
        }));
    });


    spriter.compile( function ( err, result ) {
        if ( err ) {
            console.log( err );
            return;
        }

        for (var type in result.symbol) {
            mkdirp.sync( path.dirname( result.symbol[ type ].path ) );
            fs.writeFileSync( result.symbol[ type ].path, result.symbol[ type ].contents );
        }

        console.log( chalk.green( 'Sprite generated' ) );
    });

})
.catch(error => {
    console.warn( error );
});
