const extend = require('extend');
const path = require('path');
const {configUtils} = require('@sxa/celt');

module.exports = {
    // Please configure
    serverOptions: {
        server: 'https://sergesc.dev.local/', //need to be changed
        removeScriptPath: '/-/script/v2/master/RemoveMedia',
        uploadScriptPath: '/sitecore modules/PowerShell/Services/RemoteScriptCall.ashx',
        updateTemplatePath: '/-/script/v2/master/ChangeTemplate',
        updateScribanPath: '/-/script/v2/master/ChangeScriban',
        mediLibraryPath: '/-/script/media/master'
    },

    //Rules for excluding files from uploading
    excludedPath: [],
    //Server check all items names with this rule. It is not recommended to change
    serverNameValidation: [
        /^[\w\*\$][\w\s\-\$]*(\(\d{1,}\)){0,1}$/
    ],
    scriban: {
        path: './-/scriban/**/*.scriban',
        metadataFilePath: './-/scriban/metadata.json'
    },
    img: {
        path: 'images/**/*'
    },
    sprites: {
        flags: {
            spritesmith: {
                imgName: 'sprite-flag.png',
                cssName: '_sprite-flag.scss',
                imgPath: '../images/sprite-flag.png',
                cssFormat: 'scss',
                padding: 10,
                algorithm: 'top-down',
                cssOpts: {
                    cssSelector: function (sprite) {
                        return '.flags-' + sprite.name;
                    }
                },
                cssVarMap: function (sprite) {
                    sprite.name = 'flags-' + sprite.name;
                }

            },
            flagsFolder: 'images/flags/*.png',
            imgDest: './images',
            cssDest: './defaulttheme/sass/base/sprites'
        }
    },
    user: { login: 'sitecore\\admin', password: 'b' },

    init: function () {
        extend(this.serverOptions, configUtils.getConf().serverOptions);
        return this;
    }

}.init();