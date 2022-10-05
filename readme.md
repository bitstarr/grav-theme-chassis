# Grav Theme Boilerplate "Chassis"

This is a WIP starting point for custom themes for grav CMS.

We are using some gulp magic to help with boring and repetitive tasks. Please learn first about the file structure and the way assets are organized and processed in this project.

## Dependecies

Chassis provides templates and styles for the following plugins (if you install and enable them…)

* breadcrumbs
* forms
* markdown-details
* markdown-notices
* pagination

## File Structure

````
.
├── /admin                  Admin modifications and enhancements
│   └── /buttons                Editor buttons
├── /assets                 "raw" assets
│   ├── /css                   CSS files
│   │   ├── /base                   settings, normalization, helper
│   │   ├── /form                   form components
│   │   ├── /molecule               simple modules
│   │   ├── /oranism                complex modules
│   │   ├── /template               template/page specifics (e.g. spacing)
│   │   ├── /vendor                 3rd party / plugin styles
│   │   └── admin.css               admin style modifications
│   │   ├── fonts.css               dedicated web font style sheet
│   │   └── main.css                main style sheet
│   ├── /favicon                favicons/app icons
│   ├── /fonts                  font files in WOFF2 format
│   ├── /icons                  SVG icons
│   ├── /img                    static images
│   │   ├── marker.svg              map marker template
│   │   └── social.jpg              default open graph image
│   └── /js                     JS files
│       ├── /src                    JS (bundle) source files
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
├── /langages               translation files
├── /shortcodes             custom shortcodes
├── /templates              grav templates
│   ├── /email                  email templates
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

## Fonts

It's good practice to use only WOFF2 format fonts now. Browser support is good and we provide a fallback to system fonts. Also make sure to subset (use [Font Squirrels generator](https://www.fontsquirrel.com/tools/webfont-generator) or [Font Mangler](https://github.com/bitstarr/font-mangler)) to reduce the file sizes. In build or with the dedicated command the fonts will be put in `/dist`.

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

## Renaming the theme

This is a bit trickey since grav has not only one place to set the name. In order to rename the theme you will need to follow these steps (let's take picasso for example):

* rename the theme folder `chassis` -> `picasso`
* rename `/chassis.yaml` and `/chassis.php` in `picasso.*`
* change the name in `/blueprints.yaml`
* in the file formerly known as `/chassis.php` rename the class name, mind the capital first letter `class Chassis extends Theme` -> `class Picasso extends Theme`
* there are occurrences regarding the utility class in the same file, rename and follow the capitalization
* in `/classes/Utils.php` rename the namespace definition, mind the capitalization
* make sure all occurrences of utility functions in the template folder are renamed (search for chassis in files)

When Using a dash in the theme name you will have to CamelCase ( upper camel case) the namespaces and class names.

## Shortcodes

### caption

```md
[caption class="image" caption="Quelle: Unsplash.com"]
![](image.jpg)
[/caption]
```

Adds a caption (via HTML `figure` + `figcaption`) to your media (image, video, embed, audio).

### email

```md
[email link=1]Chunkylover53@aol.com[/email]
```

Mask E-Mails with HTML entities to give some spam protection. `link` parameter is optional and makes the address a `mailto` link.

### icon

```md
[icon=mail title="E-Mail"]
```

Shortcode to use in text icons utilizing the [svg-extension](https://github.com/bitstarr/grav-plugin-svg-extension) plugin.

As seen in the example the first word is the icon name, optional parameters follow after that.

| Paramter | Effect |
| --- | --- |
| id | Set an ID for the SVG element |
| class | Set the CSS classes for the SVG element |
| title | Set a title (accessability) |


### lang

```md
[lang=fr inline=1]Bonjour[/lang]
```

Wrap text in a different language semantically, so screenreader can interpret and pronounce it correctly. By default it wraps the text in a `div`, adding the optional `inline` parameter wraps it in a `span`.

### video

```md
[video=Uuad8V5f_QA]
[video="https://www.youtube.com/watch?v=Uuad8V5f_QA"]
[video id=Uuad8V5f_QA]
[video id="https://www.youtube.com/watch?v=Uuad8V5f_QA"]
[video id=141358 type=vimeo]
```

Embed a video from YouTube or Vimeo with a privacy alert. The video will only load (and request external resources) if the user affirms (once or for the whole site).

! This components CSS and JS need to be added to processing. They are not enabled by default.

Some interpretations of the following options depend on the video platform.

| Paramter | Effect | Values | Default |
| --- | --- | --- | --- |
| id | Video ID or URL | string or URL | – |
| type | Which video platform | youtube or vimdeo | youtube |
| showinfo | Include information overlays | 0 or 1 | 0 |
| controls | Show video player controls | 0 or 1 | 1 |
| color | Controls color | red, white, hexcode | white |
| class | Additional CSS classes for the embed wrapper | string | – |

### raw

```md
[raw][email link=1]Chunkylover53@aol.com[/email][/raw]
```

This is a helper to show shortcodes in pages without getting them processed.