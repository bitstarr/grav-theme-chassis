/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 */

module.exports = {
    files: [ process.env.npm_package_config_dist + '**/*' ], // provied by package.json
    watch: true,
    watchOptions: {
        ignoreInitial: true,
        // usePolling: true,
    },
    notify: true,
    proxy: process.env.npm_package_config_bsProxy, // provied by package.json
    open: false,
};
