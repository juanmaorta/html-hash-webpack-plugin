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

HtmlHashPlugin.prototype.apply = function (compiler) {
    var settings = this.settings;

    // statsData seems to be a global variable
    compiler.plugin('done', function (statsData) {
        var stats = statsData.toJson();

        if (!stats.errors.length) {
            var htmlFileName = settings.html_file,
                html = FileSystem.readFileSync(path.join(settings.origin, htmlFileName), 'utf8'),
                htmlOutput = html,
                re,
                chunkNames,
                ext;

            var publicPath = stats.publicPath;
            if (publicPath[0] == "/")
                publicPath = publicPath.substr(1);

            for (chunk in stats.assetsByChunkName) {
                chunkNames = stats.assetsByChunkName[chunk];
                if (!Array.isArray(chunkNames))
                    chunkNames = [chunkNames];

                for (var i = 0; i < chunkNames.length; i++) {
                    var name = chunkNames[i];

                    ext = name.substr(name.lastIndexOf('.') + 1);
                    re = new RegExp('(=[\'"]/?' + publicPath + ')(' + chunk + ')\.' + ext + '([\'"])', "i");
                    htmlOutput = htmlOutput.replace(re, function (full, prefix, chunk, postfix) {
                        return prefix + name + postfix;
                    });
                }
            }

            FileSystem.writeFileSync(
                path.join(settings.output, htmlFileName),
                htmlOutput
            );
        }
    });
};

module.exports = HtmlHashPlugin;
