var FileSystem = require('fs'),
    path = require('path');

function HtmlHashPlugin(options) {
    // Setup the plugin instance with options...
    defaults = {
        origin: path.resolve(__dirname),
        output: path.resolve(__dirname),
        html_file: 'index.html',
    };

    this.settings = Object.assign(defaults, options);
};

HtmlHashPlugin.prototype.apply = function(compiler) {
    var settings = this.settings;

    // statsData seems to be a global variable
    compiler.plugin('done', function(statsData) {
        var stats = statsData.toJson();

        if (!stats.errors.length) {
            var htmlFileName = settings.html_file,
                html = FileSystem.readFileSync(path.join(settings.origin, htmlFileName), 'utf8'),
                htmlOutput = html,
                re;

            for(chunk in stats.assetsByChunkName) {
                re = new RegExp('<script src=(.*)(' + chunk + ')\.js(.*)', 'i');
                htmlOutput = htmlOutput.replace(re, function(full, prefix, chunk, postfix) {
                    return '<script src=' + prefix + stats.assetsByChunkName[chunk] + postfix;
                });
            }

            FileSystem.writeFileSync(
                path.join(settings.output, htmlFileName),
                htmlOutput
            );
        }
    });
};

module.exports = HtmlHashPlugin;
