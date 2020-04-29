<div align="center">
<h1>Umbrella for Sitecore SXA</h1>
<p>
SXA Umbrella provides the project structure and tooling to optimize the front-end team development workflow in any Sitecore SXA project. 
</p>
</div>

# Introduction

The roots of SXA Umbrella lie in the [SXACLI-enhancements]() project where we embraced the SXA CLI tooling provided by Sitecore that provided a developer-first approach for our front-end developers in SXA development. The out-of-the-box SXA CLI functionality was insufficient for our development workflow so we extended it with an extensive set of additional functionality to support the team development cycle. The SXACLI-enhancement project was built on top of the code-base of SXA CLI and was limited to handle a single SXA theme and the creation of rendering variants using Scriban for a single SXA site. This approach was too limited for our SXA projects, so we decided to do a complete rewrite of the code-base to support the creation of multiple **themes**, **base themes**, **theme extensions**, **grids**, and **rendering variant** collections for multiple sites (for example a shared site and multiple other sites). 

# SXA Umbrella enhancements over standard SXA CLI

The out-of-the-box SXA CLI is a bit limited. It only supports a single gulp task, this task sync's all changes made in the project to Sitecore. So only if you change something it will be deployed to Sitecore. in SXA Umbrella we provide a huge set of enhanced features

## Support for a team development cycle
    
A Sitecore SXA project is team-work, so the tooling must support a typical team development cycle:

- Pull the latest code from source control
- Build all artifacts and do a full deploy to a personal Sitecore instance
- Start watch node for incremental deploy of changed artifacts to Sitecore
- Commit changes to source-control

## Webpack compatible SASS
  
For modern front-end development, we need a bundler for the creation of JavaScript and CSS bundles. Webpack is a good bundler that we use in SXA Umbrella. The problem is that the default Sitecore theme code as delivered in the NPM module `sxa/Theme`, and copied into the project by SXA CLI, is not Webpack compatible due to non-standard SASS language constructs used in the code-base (wildcard imports). SXA Umbrella provides an NPM package `sxa-defaulttheme` in the `local_modules` where the issues are fixed ad the default provided the is turned into a Webpack compatible code-base.
  
## Webpack based scripts transpilation

SXA Umbrella provides Webpack based transpilation of JavaScript, ES and TypeScript from the `src` folder into a single `scripts\pre-optimized-min.js` file to be deployed to Sitecore:

- Support for embedded sourcemaps in *development* mode for full debugging support in the browser using the source files
  ![Code debugging](docs/code_debugging.png)
- Optimized, minified and no sourcemaps in *production* mode

## Webpack based styles transpilation

SXA Umbrella provides Webpack based transpilation of SASS from the `src` folder and (through imports) from the  `sxa-defaulttheme` node module into a single `scripts\pre-optimized-min.css` file to be deployed to Sitecore
    
- Support for embedded sourcemaps in *development* mode for full traceability of the origin of styles
![Styling traceability](docs/styling_traceability.png)   
- Optimized, minified and no sourcemaps in *production* mode

## Full configuration for TypeScript compilation

[TypeScript - JavaScript that scales](https://www.typescriptlang.org/). The tag-line on the TypeScript site says it all. When working in a team (even a team of one) type-checking is an invaluable tool to prevent issues that can be prevented easily by a computer. SXA Umbrella comes with batteries included by providing an NPM package `sxa-styles` in the `local_modules` providing the TypeScript types for the XA library to build Sitecore SXA compatible components the SXA way

## Minimal configuration

The configuration for SXA Umbrella is as minimal as possible due to convention over configuration. The folder structure provides information about what should be deployed where. We need to configure things like:
- The target Sitecore server and credentials for deployment (config/config.json)
- Per rendering variant collection the GUID of the site to deploy to
- Per theme (base theme, theme, extension theme, grid) we need an entry in the Webpack configuration 

# How to get started

In a few simple steps, you can get up and running with SXA Umbrella:

1. Get a Sitecore 9.3 environment with SXA enabled
2. Create a tenant `DMP` with a site `DMP Site` (DMP stands for Digital Marketing Platform) 
3. Navigate to https://github.com/macaw-interactive/sxa-umbrella, and download a zip file with the latest code
4. Unzip the downloaded zip file into a convenient folder for your front-end code  
5. On the Sitecore server open `PathToInstance/Website/App_Config/Include/z.Feature.Overrides` (in previous version of Sitecore it can be `PathToInstance/Website/App_Config/Include/Feature`) folder and remove `.disabled` from the `z.SPE.Sync.Enabler.Gulp.config.disabled` file
6. Switch to the front-end code folder
7. Update the `config/config.json` file to reflect your Sitecore server and credentials
8. Open the front-end code folder with the command-line
9. Run `npm install` (*node.js and npm should be already installed*)
10. Configure the `metadata.json` file with the GUID of the site to deploy to
11. Run `npm run build-deploy-watch` to kickstart the whole process

# SXA Umbrella folder structure

The SXA Umbrella front-end folder is organized as follows:


# NPM Scripts to support team development

The full set of NPM scripts available to support team development:

| NPM Command | Description |
| ----------- | ----------- |
| npm run build-deploy-watch | Build everything, deploy to Sitecore and go into watch mode | 
| npm run watch | Go into watch mode, assume Sitecore is up-to-date with current code |
| npm run build-deploy | Build everything and deploy to Sitecore |
| npm run build | Build everything for development mode - sourcemaps! |
| npm run build:prod | Build everything in production mode - optimized, no sourcemaps; result will be in the `dist` folder (*) |
| npm run clean | Clean source tree from generated artifacts |

(*) Note that during a production build (to be executed on a build server) the resulting artifacts for themes and grids will end-up in the `dist` folder in the root of the front-end folder. These artifacts should be part of the deployment package for Sitecore together with a custom script to deploy the files as items in Sitecore. The rendering variant items should be deployed using Unicorn. 

# Writing components the SXA way

There is an example of a TypeScript component written the SXA way at `sources/components/xaclock`.

TypeScript types for SXA way of writing components is available as  `sxa-types/xa`.

*More information will be added for building components the SXA way*
   
# Working with the source code

- We tried not to touch the sass folder at all, except for the requirement to run the `npm run fix-sass-for-webpack` task to be executed to modify the supplied codebase to work with webpack.
- The root of the sass is in the file `sources/index.scss`, this file is included by `sources/index.ts` and the extraction of the CSS bundle is handled by webpack.
- Overrides on the provided sass for theming should be done in the file `sources/theme.scss`. This could later be extended to create multiple teams from the same sass codebase by just providing different `theme.sass` files in the transpilation.
- The file `sources/index.ts` is the entry point of all code (TypeScript, ES, JavaScript, SASS)

ot touching the sass folder allows us to update the sass source code provided by Sitecore when a newer version of the npm package `@sxa/Theme` comes out. In that case, only the files in the folder `node_modules/@sxa/Theme/sass` need to be copied over to the `sass` folder in our create theme folder.


# The implementation

The most important part of our implementation is:

- the scripts defined in the `scripts` section of `package.json`
- the Gulp tasks defined in index.js
- the `webpack.config.js` configuration file for webpack, with the supporting `postcss.config.js` used for building the production css bundle and the `tsconfig.json` file for the configuration of the Typescript transpilation

We kept the original scripts as original as possible.

Most configurations as specified in `gulp/config.js` are respected, although the webpack configurations make assumptions about the location of source code in the `sources` folder.


# What does the standard Sitecore SXA CLI provide

Out of the box SXA CLI provides the following features:

- Sync single minified CSS file (based on SASS, CSS, sprites) - including support to sync the source files to Sitecore 
- Sync single minified JavaScript file (based on JavaScript, ES) - including support to sync the source files to Sitecore
- Sync Scriban files
- Sync image files
- Sync HTML files (required for Creative exchange only?!)

It does this through a **watch** mode, where transpile and package is executed on changed files.

See the [Sitecore SXA CLI documentation](https://doc.sitecore.com/developers/sxa/93/sitecore-experience-accelerator/en/add-a-theme-using-sxa-cli.html) and the documentation below for more information. 

# Blog posts about Sitecore SXA CLI

The blog posts below contain some important information to get the initial configuration of your system in good shape to start working with Sitecore SXA CLI:

- [Sitecore 9.3 - create a custom theme for SXA using SXA CLI](https://www.sergevandenoever.nl/sitecore-93-custom-theme-with-SXA-CLI/)
- [Sitecore 9.3 SXA CLI - get item fields](https://www.sergevandenoever.nl/Sitecore-93-SXA-CLI-GetItemFields/)
- [Sitecore SXA theme investigation](https://www.sergevandenoever.nl/Sitecore-SXA-Theme-Investigation/)

sxa-defaulttheme:

  NPM task `create-fixed-defaulttheme-sass-for-webpack` (executed by build) to copy and fix the sass code for the default theme as provided by Sitecore in the npm package @sca/Theme by expanding wildcard imports to the actual imports, otherwise, the sass can't be transpiled by webpack


# Frequently asked questions

### Why is the `config/config.json` file a JSON file and not JavaScript?

It should be easy for tools to read the configuration settings, also for non-JavaScript tools like PowerShell scripts.

### Why do I need to add an entry per theme in the Webpack configuration file?

The file `config\webpack.config.js` contains multiple output configurations as shown in the [multi-compiler](https://github.com/webpack/webpack/tree/master/examples/multi-compiler) example. We could easily automate the generation of the required configurations if all themes needed to be compiled alike, but we see potential cases where a different configuration is required. A good example is when a theme contains additions output configurations for a React bundle. 

### Why does a rendering variants collection for a web site to be in a folder `-/scriban`?

The used end-point for uploading Scriban files checks the Scriban file paths for the occurence of the string `-/scriban` to determine the relative path within the folder `<sites>/Presentation/Rendering Variants` folder to deploy to.

### Can the front-end folder be partitioned into multiple deployment packages?

When you are working with multiple teams on separate solutions for a Sitecore environment that should be deployed separately, there is no reason why you can't have multiple solutions with a front-end folder containing the SXA Umbrella setup.

