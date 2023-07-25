import glob from 'glob';
import path from 'path';
import fs from 'fs';
import { mkdirp } from 'mkdirp'
import chalk from 'chalk';

import { minify } from 'terser';

const config = {
    src: process.env.npm_package_config_js, // provided by package.json
    subSrc: process.env.npm_package_config_jsSrc, // provided by package.json
    dist: process.env.npm_package_config_jsDist, // provided by package.json
};

const cwd = path.resolve( config.src );

console.log( chalk.magenta( 'Generating Production JavaScript' ), '\n' );

// create js in dist, if not present
mkdirp.sync( config.dist );

// go through the json files
await glob( '*.json', { cwd: cwd } ).then( files =>
{
    // each bundle file
    files.forEach( ( bundle ) =>
    {
        // get the file content
        bundle = {
            name: bundle,
            content: fs.readFileSync( path.join( config.src, bundle ) ),
            distName: path.format({
                name: path.basename( bundle, '.json' ),
                ext: '.js'
            })
        };

        // parse JSON string to JSON object
        const thisBundle = JSON.parse( bundle.content );

        // file bucket
        let collection = {};

        // add every referenced item to our collection
        // first the libs
        if ( typeof thisBundle.lib == 'object' ) {
            thisBundle.lib.forEach( function( item )
            {
                collection[ item ] = fs.readFileSync( path.join( '.', 'node_modules', item ), 'utf8' );
            });
        }
        // now our own code
        if ( typeof thisBundle.src == 'object' ) {
            thisBundle.src.forEach( function( item )
            {
                collection[ item ] = fs.readFileSync( path.join( config.subSrc, item ), 'utf8' );
            });
        }

        // let terser concat and uglify the bundle
        createBundle( collection, path.join( config.dist, bundle.distName ) );
    });
}).catch(error => {
    console.warn( error );
});

// copy js files in js-root
await glob( '*.js', { cwd: cwd } ).then( files =>
{
    // each standalone file
    files.forEach( ( file ) =>
    {
        let collection = {
            'file': fs.readFileSync( path.join( config.src, file ), 'utf8' )
        };

        createBundle( collection, path.join( config.dist, file ) );
    });
}).catch(error => {
    console.warn( error );
});

async function createBundle( bundle, destination )
{
    let result = await minify( bundle, { format: { comments: false } }  );
    fs.writeFileSync( destination, result.code, 'utf8' );
    let fileName = path.basename( destination, '.json' );
    let msg = ( Object.keys(bundle).length > 1 ) ? 'bundled and minified' : 'minified';
    console.log( chalk.whiteBright( fileName ) + ' ' + chalk.green( msg ) );
}

