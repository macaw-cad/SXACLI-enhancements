# Introduction

As [described by Sitecore](https://doc.sitecore.com/developers/sxa/93/sitecore-experience-accelerator/en/add-a-theme-using-sxa-cli.html):

 _SXA CLI is a useful command line tool to automatize tasks for an SXA project. This topic describes how to add a theme using SXA CLI. This can be convenient if you want to have more control over your assets and use a version control system, such as Git._

For us it is important tooling because it provides a developer first approach for our front-end developers in SXA development.

Because the out-of-the box functionality was insufficient for our development workflow we extended it with an extensive set of functionality described below.

# Blog posts about Sitecore SXA CLI

The blog posts below contain some important information to get the initial configuration of your system in good shape to start working with Sitecore SXA CLI:

- [Sitecore 9.3 - create a custom theme for SXA using SXA CLI](https://www.sergevandenoever.nl/sitecore-93-custom-theme-with-SXA-CLI/)
- [Sitecore 9.3 SXA CLI - get item fields](https://www.sergevandenoever.nl/Sitecore-93-SXA-CLI-GetItemFields/)
- [Sitecore SXA theme investigation](https://www.sergevandenoever.nl/Sitecore-SXA-Theme-Investigation/)

# SXA CLI enhancements

The out of the box SXA CLI is a bit limited, so we provide al huge set of enhanced features:

- Support for a team development cycle:
    - Pull the latest code from source control
    - Build all artifacts and full deploy to personal Sitecore instance
    - Start “watch” – incremental deploy of artifacts
    - Commit changes

- NPM task `npm run fix-sass-for-webpack` to fix the sass code by expanding wildcard imports to the actual imports, otherwise the sass can't be transpiled by webpack
  
- Webpack based transpile of JavaScript, ES and TypeScript from the `sources` folder into a single `scripts\pre-optimized-min.js` file to be deployed to Sitecore
    - Support for embedded sourcemaps in development mode for full debugging support in the browser using the original source files
      ![Code debugging](docs/code_debugging.png)
    - Optimized, minified and no sourcemaps in production mode
  

- Webpack based transpile of SASS from the `sources` and `sass` folder into a single `scripts\pre-optimized-min.css` file to be deployed to Sitecore
    - Support for embedded sourcemaps in development mode for full tracability of the origin of styles
  ![Styling traceability](docs/styling_traceability.png)   
    - Optimized, minified and no sourcemaps in production mode

- Full configuration for TypeScript compilation

- Script `create-scriban-metadatajson.ps1` for the creation of the missing and undocumented `-/scriban/metadata.json` file

- Full set of NPM commands to support team development:

  | NPM Command | Description |
  | ----------- | ----------- |
  | npm run doc | Generate documentation for the code in the folder `jsdoc ` |
  | npm run build-and-watch | Build everything, deploy to Sitecore and go into watch mode | 
  | npm run watch | Go into watch mode, assume Sitecore is up-to-date with current  code |
  | npm run build-and-deploy | Build everything and deploy to Sitecore |
  | npm run build | Build everything for development mode - sourcemaps! |
  | npm run build:prod | Build everything in production mode - optimized, no sourcemaps |
  | npm run clean | Clean source tree from generated artifacts |
  | npm run fix-sass-for-webpack | Fix wildcard imports in sass code base |
  | npm run publish-theme | Publish the theme from master to web database using PowerShell remoting |

- Example of a TypeScript component written the SXA way at `sources/components/xaclock`

- TypeScript types for SXA way of writing components at  `types/xa.d.ts`
   
We also provide some simple scripts:

- `node runGulpTask.js <task>` to execute one or more gulp task directly
- `node uploadFiles.js <files>` to trigger upload to Sitecore of one or more files, supporting wildcards
- `node uploadScriban.js` upload the Scriban files to Sitecore
- `.\get-itemfields.ps1 <Sitecore-item-path>` to get information of the internal names of the fields of an item

# Getting started

To get started you could clone this repository and run the `sxa init` and `sxa register <instanceUrl>` commands as described in the [documentation](https://doc.sitecore.com/developers/sxa/93/sitecore-experience-accelerator/en/add-a-theme-using-sxa-cli.html) to get it configured for your system.

# Working with the source code

- We tried not to touch the sass folder at all, except for the requirement to run the `npm run fix-sass-for-webpack` task to be executed to modify the supplied codebase to work with webpack.
- The root of the sass is in the file `sources/index.scss`, this file is included by `sources/index.ts` and the extraction of the CSS bundle is handled by webpack.
- Overrides on the provided sass for theming should be done in the file `sources/theme.scss`. This could later be extended to create multiple teams from the same sass codebase by just providing different `theme.sass` files in the transpilation.
- The file `sources/index.ts` is the entry point of all code (TypeScript, ES, JavaScript, SASS)

ot touching the sass folder allows us to update the sass source code provided by Sitecore when an newer version of the npm package `@sxa/Theme` comes out. In that case only the files in the folder `node_modules/@sxa/Theme/sass` need to be copied over to the `sass` folder in our create theme folder.


# The implementation

The most important part of our implementation is:

- the scripts defined in the `scripts` section of `package.json`
- the Gulp tasks defined in index.js
- the `webpack.config.js` configuration file for webpack, with the supporting `postcss.config.js` used for building the production css bundle and the `tsconfig.json` file for the configuration of the Typescript transpilation

We kept the original scripts as original as possible.

Most configurations as specified in `gulp/config.js` are respected, although the webpack configurations makes assumptions about the location of source code in the `sources` folder.


# What does the standard Sitecore SXA CLI provide

Out of the box SXA CLI provides the following features:

- Sync single minified CSS file (based on SASS, CSS, sprites) - including support to sync the source files to Sitecore 
- Sync single minified JavaScript file (based on JavaScript, ES) - including support to sync the source files to Sitecore
- Sync Scriban files
- Sync image files
- Sync HTML files (required for Creative exchange only?!)

It does this through a **watch** mode, where transpile and package is executed on changed files.

See the [Sitecore SXA CLI documentation](https://doc.sitecore.com/developers/sxa/93/sitecore-experience-accelerator/en/add-a-theme-using-sxa-cli.html) and the documentation below for more information. 

# Sitecore provided readme with SXA CLI created theme

Below is the original readme provided when a theme is scaffolded using the Sitecore SXA CLI. Note that most commands are overriden by the functionality provided in this repository.

## Boilerplate for creating new theme for you Sitecore site. 

## For using Autosynchronizer, you need to complete next steps:

1. Download theme boilerplate;
2. Open *PathToInstance/Website/App_Config/Include/z.Feature.Overrides* (in previous version of sitecore it can be *PathToInstance/Website/App_Config/Include/Feature*) folder and remove **.disabled** from **z.SPE.Sync.Enabler.Gulp.config.disabled** file;
3. Switch to downloaded theme boilerplate folder
4. Update config file for Gulp tasks. **ThemeRoot/gulp/config.js** file:
    1. `serverOptions.server` - path to sitecore instance. Example `server: 'http://sxa'`;
6. If you use Creative exchange skip this step. Open **ThemeRoot/gulp/serverConfig.json** 
     1. `serverOptions.projectPath` - path to project, where theme placed. Example ` projectPath: '/themes'`;
    2. `serverOptions.themePath` - path to basic theme folder from project root. Example ` themePath: '/Basic2'`;
5. Open Theme root folder with command line.
6. Run `npm install` (*node.js and npm should be already installed*);
7. If gulp is not yet installed - Install gulp using following command: `npm install --global gulp-cli` 
8. Run gulp task which you need: <br/>
    Global tasks:
    1. `gulp default` or just `gulp` - starts `gulp all-watch`.
    2. `gulp all-watch` - run a list of tasks:<br/>
            `sass-watch`<br/>
            `js-watch`<br/>
            `es-watch`<br/>
            `css-watch`<br/>
            `img-watch`<br/>
            `watch-source-sass`<br/>
            `html-watch`<br/>

    For SASS
    1. `gulp sass-watch` - run a list of tasks:
        `watch-component`
        `watch-base`
        `watch-styles`
        `watch-dependency`
    1. `gulp sassComponents` - to compile sass styles just for components;
    2. `gulp sassStyles` - to compile sass additional styles for component;
    3. `gulp watch-styles` - watch changes under **sass/styles/common** , **sass/styles/content-alignment** , **sass/styles/layout** folders and compile all of them to **styles/styles.css**;
    4. `gulp watch-base` - watch on changes under  **sass/abstracts/**, **sass/base/** , **sass/components** folders and run compiling of components and styles;
    5. `gulp watch-component` - watch changes of component styles under *sass* folder and compile them to **styles** folder;
    6. `gulp watch-dependency` - watch changes under **sass/styles/** (exluded **sass/styles/common** , **sass/styles/content-alignment** , **sass/styles/layout**) and compile appropriate component;

    For CSS
    1. `gulp css-watch` - watch on changes of css files under **stytles** folder and upload them to server;

    For JavaScript:
    1. `gulp eslint` - run eslint for all js in **scripts** folder;
    2. `gulp js-watch` - watch on changes of js files under **scripts** folder and upload them to server;
    2. `gulp es-watch` - watch on changes of ES6+ js files under **sources** folder and upload them to server;
   
    For HTML (if you work with creative exchange)
    1. `gulp html-watch` - watch changes of html files and upload them to the server;

    For Gulp files
    1. `gulp watch-gulp` - watch on changes of js and json files under **gulp** folder and upload them to server;

    For Images
    1. `gulp img-watch` - watch on changes under **images** folder and upload files to server;

    For Sprite
    1. `gulp spriteFlag` - to create sprite for flags;

9. When watcher starts you need to enter you login and password for Sitecore, for uploading reason.

