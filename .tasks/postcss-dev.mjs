import glob from 'glob';
import path from 'path';
import fs from 'fs';
import { mkdirp } from 'mkdirp'
import chalk from 'chalk';

import postcss from 'postcss';
import importing from 'postcss-import';
import nesting from 'postcss-nested';
import autoprefixer from 'autoprefixer';

const config = {
    src: process.env.npm_package_config_css, // provided by package.json
    dist: process.env.npm_package_config_cssDist, // provided by package.json
};

console.log( chalk.magenta( 'Generating Development CSS' ), '\n' );

await glob( '*.css', { cwd: path.resolve( config.src ) })
    .then( files =>
    {
        processStack( files )
    })
    .catch(error => {
        console.warn( error );
    });

await glob( '*.css', { cwd: path.resolve( config.src + 'page/' ) })
    .then( files =>
    {
        processStack( files, config.src + 'page/' )
    })
    .catch(error => {
        console.warn( error );
    });

function processStack( files, folderPath = config.src )
{
    files.forEach( ( file ) =>
    {
        fs.readFile( folderPath + file, ( err, css ) =>
        {
            postcss( [
                importing,
                nesting,
                autoprefixer,
            ] )
                .process( css,
                    {
                        from: folderPath + file,
                        to: config.dist + file,
                        map:
                            {
                                inline: false,
                                annotation: true,
                            },
                    })
                .then( result =>
                {
                    result.warnings().forEach( function ( warn )
                    {
                        console.warn( warn.toString() );
                    });

                    mkdirp.sync( path.dirname( result.opts.to ) );

                    fs.writeFile( result.opts.to, result.css, (err) =>
                    {
                        if (err) throw err;
                        console.log( result.opts.to + ' ' + chalk.green( 'generated' ) );
                    });

                    if ( result.map )
                    {
                        fs.writeFile( result.opts.to + '.map', result.map.toString(), (err) =>
                        {
                            if (err) throw err;
                            console.log( result.opts.to + ' ' + chalk.green( 'Map generated' ) );
                        });
                    }
                });
        });
    });
}
