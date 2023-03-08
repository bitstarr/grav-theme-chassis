import glob from 'glob';
import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp'
import chalk from 'chalk';

const config = {
    src: process.env.npm_package_config_fonts, // provided by package.json
    dist: process.env.npm_package_config_fontsDist, // provided by package.json
}

const cwd = path.resolve( config.src );

await glob( '*.{jwoff,woff2}', { cwd: cwd } ).then( files =>
{
    console.log( chalk.magenta( 'Processing Fonts' ), '\n' );

    // you could do some automated subsetting here…

    // create fonts folder in dist, if not present
    mkdirp.sync( config.dist );

    // clear folder
    for ( const file of fs.readdirSync( config.dist ) ) {
        fs.unlink( path.join( config.dist, file ), (err) => {
            if (err) throw err;
        });
    }

    // copy files
    files.forEach( ( file ) =>
    {
        fs.copyFile( path.join( config.src, file ), path.join( config.dist, file ), (err) => {
            if (err) throw err;
            console.log( chalk.whiteBright( file ) + ' ' + chalk.green( 'copied' ) );
        });
    });
})
.catch(error => {
    console.warn( error );
});