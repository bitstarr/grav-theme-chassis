# Grav Theme Boilerplate "Chassis"

This is a WIP starting point for custom themes for grav CMS.

We are using some gulp magic to help with boring and repetitive tasks. Please learn first about the file structure and the way assets are organized and processed in this project.

## File Structure

````
.
├── /assets                 "raw" assets
│   ├── /css                   CSS files
│   │   ├── /base                   settings, normalization, helper
│   │   ├── /molecule               simple modules
│   │   ├── /oranism                complex modules
│   │   ├── /template               template/page specifics (e.g. spacing)
│   │   ├── /vendor                 3rd party / plugin styles
│   │   ├── fonts.css               dedicated web font style sheet
│   │   └── main.css                main style sheet
│   ├── /favicon                favicons/app icons
│   ├── /fonts                  font files in WOFF and WOFF2 format
│   ├── /icons                  SVG icons
│   ├── /img                    static images
│   │   ├── marker.svg              map marker template
│   │   └── social.jpg              default open graph image
│   └── /js                     JS files
│       ├── base.js                 JS component placeholder
│       └── dev.json                JS bundle base only used in local env.
├── /blueprints             grav blueprints for page types
├── /classes                custom PHP Classes
│   └── Utils.php               utilty class with helper functions
├── /dist                   build files
│   ├── /css                    minified CSS files
│   ├── /fonts                  duplicates of assets/fonts
│   ├── /icons                  optimized and minified icons
│   ├── /img                    optimized images
│   └── /js                     minified JS files and bundles
├── /templates              grav templates
│   ├── /forms                  custom form elements for better styling
│   ├── /macros                 macros to use with twig
│   ├── /modular                templates for modular page elements
│   ├── /partials               template parts
│   └── *.html.twig             page templates
├── blueprints.yaml         theme definition
├── chassis.php             theme functions
├── chassis.yaml            theme config file
├── gulpfile.js
└── package.json
````

## CSS Processing

We are using PostCSS for convinience. It will inline `@import`, resolve nesting and autoprefix. We could also enable usage of custom properties (variables) in media query definitions by editing the `config.postcss` object in `gulpfile.js`.

`/assets/css/main.css` is the main CSS file and hub. You find only imports in it, which will be inlined in processing. If you need to, you can add other CSS files parallel to main.css to provide other subsets or differently scoped styles. Every CSS file stored directly in `/assets/css/` will be processed and the result stored in `/dist/css/`.

Additionally this will also happen to CSS files in `/assets/css/page`. So you can create per page additions or overwrites which can be referenced by templates. If you don't need this in you project, remove this part of the source list in the CSS tasks of `gruntfile.js`.

## JS Files und Bundles

In ``/assets/js`` you will find .js und .json files as well as a `src` folder. In this setup (no webpack or other advanced magic) the JS files are independent functional components. JSON files are the base for bundles. With these you can concatinate multiple components from the `src` folder as well as libraries from `/node_modules` which you installed via npm (see example below). In bundles the order is important. The libs will appear before the code from `src`.

Every JS file in ``/assets/js`` will be copied in ``/dist/js``. Bundles will run through a concatiantion of their parts and the result will be saved as js in ``/dist/js``. Please be aware that there will be conflicts if the filenames of a bundle and a standalone component are the same (foobar.js and foobar.json for example).

````json
{
    "lib": [
        "choices.js/public/assets/scripts/choices.min.js"
    ],
    "src": [
        "address.js",
        "userprofile.js"
    ]
}
````

## Images

All image files in `/assets/img` will be optimized on build (or calling it manually) using `imagemin` (svgo, pngQuant, mozJpeg, gifLossy, Zopfli) and stored in `/dist/img`. When using the watch task images will simply be copied to avoid waiting times in development.

## About `/dist`

If you are using a CI Server you can add the `/dist` folder to `.gitignore`. Otherwise you should make a build before every merge with you master branch, so the master branch includes the minified and most optimized assets in `/dist`.

## Configuration

In `package.json` you will find an onject called `config`. Here are paths stored that are used by gulp.

## Browsersync / LiveReload

To use this feature make sure you set up the correct URL of your project in `config.bsProxy` in `package.json`.

When the `watch` task is running, you can access [http://localhost:3000](http://localhost:3000). Depending on you network or firewall configuration you could also access this port with other devices to do even more cross device/browser testing. `Browsersync` will keep scrolling position (procetual) in sync

The `watch` task will force refreshes on CSS and JS files via Browsersync so you can see instantly the impact of your changes.

On port 3001 you can access the Browsersync control panel.

## Task Runner

Wir use `gulp` as task runner, which is wrapped in npm sripts to streamline workflows.

| command | function |
|---|---|
| npm run css | processes the CSS and saves them to `/dist/css` |
| npm run cssmin | same as `css` but with minifying |
| npm run js | creates JS bundles and copies JS files to `/dist/js` |
| npm run jsmin | minifies all JS files in `/dist/js` |
| npm run lint | checks CSS and JS assets for bad coding styles and errors |
| npm run fonts | copies font files to `/dist/fonts` |
| npm run img:sloppy | simply copies images from  `/assets/img` to `/dist/img` |
| npm run img | optimizes images and saves results to `/dist/img` |
| npm run icons | optimizes icons and saves results to `/dist/icons` |
| npm run imagemin | optimizes images and icons |
| npm run favicons | optimize favicon files and save them in `/dist/` - move them from here |
| npm run watch | watch for changes and process changed or new files |
| npm run todo | find all occurances of todos |
| npm run clean | clear `/dist` |
| npm run dev | runs `css`, `js`, `img:sloppy` and `icons` in parallel once |
| npm run build | runs `lint`, `clean`, `cssmin`, `js`, `jsmin`, `imgmin` and `fonts` |