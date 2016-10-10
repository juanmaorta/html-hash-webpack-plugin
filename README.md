html-hash-webpack-plugin
========================

A webpack plugin that parse HTML in search of links to **publicPath** directory and replaces filenames with real webpack chunk names.


The plugin takes the webpack compiler stats object and looks inside html text for links to webpack entries by name. All strings like ...**="[publicPath]/[entry].[ext]"**...
are replaced to their real output chunk names. Plugin replaces links to any files, including js, css, etc. Forward slash in **publicPath** inside html can be omitted.

# Requirements

Webpack entries and their output file names inside original index.html should be the same. For example, if you have entry named "vendors",
so there should be a link to [publicPath from webpack config]/vendors.[any ext] in html, or it will not be "hashed".
Webpack chunks/entries should have dynamic names (with [id], [hash], [chunkhash], etc), otherwise you do not need this plugin at all.

Plugin works nice with **webpack-md5-hash** plugin, so you can have vendors.[chunkhash].js file with libs,
which will not change so often and can be cached in browser; and index.[chunkhash].js with your code, which will change every code change.

Also, if you use **extract-text-webpack-plugin** to, for example, to separate css from js, plugin will handle it

# Installation

```
npm install html-hash-webpack-plugin --save-dev
```

# Usage
In webpack.config.js:
```javascript
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlHashPlugin = require('html-hash-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');

module.exports = {
    /// ... rest of config
    entry: {
        vendors: ["jquery", "react"],
        index: ["src/index.js"]
    },
    output: {
        publicPath: "/resources/",
        filename: "[name].[chunkhash].js"
    },
    plugins: [
        new HtmlHashPlugin({
            origin: 'src/',
            output: 'public/',
            html_file: 'index.html' // default_
        }),
        new webpack.optimize.CommonsChunkPlugin('vendors', '[name].[chunkhash].js'), // optional

        new WebpackMd5Hash(), /// optional
        new ExtractTextPlugin("index.[contenthash].css"), // optional
    ]
}

```

So, in the origin file, we'll have:

```html
<script src="resources/vendors.js"></script>
<script src="resources/index.js"></script>

<link href="/resources/style.css"></script>
```

After running the plugin, we'll get:

```html
<script src="resources/vendors.3cf62b347e0f9d19f4ce.js"></script>
<script src="resources/index.3cf62b347e0f9d19f4ce.js"></script>

<script src="/resources/style.35b23ebb648a636e45ed.css"></script>
```

hash numbers are just an example ;-)


MIT License
