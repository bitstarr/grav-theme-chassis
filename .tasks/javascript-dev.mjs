import glob from 'glob';
import path from 'path';
import fs from 'fs';
import { mkdirp } from 'mkdirp'
import chalk from 'chalk';

import concat from 'concat';

const config = {
    src: process.env.npm_package_config_js, // provided by package.json
    subSrc: process.env.npm_package_config_jsSrc, // provided by package.json
    dist: process.env.npm_package_config_jsDist, // provided by package.json
};

const cwd = path.resolve( config.src );

console.log( chalk.magenta( 'Generating Development JengaScript' ), '\n' );

// create js in dist, if not present
mkdirp.sync( config.dist );

// copy js files in js-root
await glob( '*.js', { cwd: cwd } ).then( files =>
{
    // copy files
    files.forEach( ( file ) =>
    {
        fs.copyFile( path.join( config.src, file ), path.join( config.dist, file ), ( err ) => {
            if (err) throw err;
            console.log( chalk.whiteBright( file ) + ' ' + chalk.green( 'copied' ) );
        });
    });
}).catch(error => {
    console.warn( error );
});

// go through the json files
await glob( '*.json', { cwd: cwd } ).then( files =>
{
    // each bundle file
    files.forEach( ( bundle ) =>
    {
        let collection = [];

        const concatName = path.format({
            name: path.basename( bundle, '.json' ),
            ext: '.js'
        });

        // read the content of the bundle file
        fs.readFile( path.join( config.src, bundle ), 'utf8', ( err, data ) =>
        {
            if ( err )
            {
                console.log( err );
                return;
            }

            // parse JSON string to JSON object
            const thisBundle = JSON.parse( data );

            // add every referenced item to our collection
            // first the libs
            if ( typeof thisBundle.lib == 'object' ) {
                thisBundle.lib.forEach( function( item )
                {
                    collection.push( path.join( '.', 'node_modules', item ) );
                });
            }
            // now our own code
            if ( typeof thisBundle.src == 'object' ) {
                thisBundle.src.forEach( function( item )
                {
                    collection.push( path.join( config.subSrc, item ) );
                });
            }

            // concatenate the collected files to one sindgle file
            concat( collection, config.dist + concatName );
            console.log( chalk.whiteBright( concatName ) + ' ' + chalk.green( 'created' ) );
        });
    });
}).catch(error => {
    console.warn( error );
});
