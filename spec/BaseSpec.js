/* eslint-env jasmine */
'use strict';

var HtmlHashPlugin = require('../index.js'),
    CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin'),
    webpack = require('webpack'),
    rm_rf = require('rimraf'),
    path = require('path'),
    fs = require('fs'),
    INPUT_DIR = path.join(__dirname, 'fixtures'),
    OUTPUT_DIR = path.join(__dirname, 'build'),
    plugin_options = {
        origin: INPUT_DIR,
        output: OUTPUT_DIR,
        html_file: 'index.html'
    };

jasmine.getEnv().defaultTimeoutInterval = 30000;

function testPlugin(webpackConfig, done, outputFile) {
    outputFile = outputFile || false;

    webpack(webpackConfig, function(err, stats) {
        var outputFileExists = fs.existsSync(outputFile);

        if (outputFile) {
            expect(outputFileExists).toBe(true);
        }

        if (!outputFileExists) {
            return done();
        }

        var htmlContent = fs.readFileSync(outputFile).toString();

        expect(htmlContent).toMatch(/vendors\.(.*).js/);
        expect(htmlContent).toMatch(/main\.(.*).js/);
        done();
    });
};

describe('HtmlHashPlugin', function() {
    afterEach(function(done) {
        rm_rf(OUTPUT_DIR, done);
    });

    it('should have hashed js files into the html', function(done) {
        testPlugin({
            entry: {
                main: path.join(__dirname, 'fixtures/index.js'),
                vendors: path.join(__dirname, 'fixtures/vendors.js')
            },
            output: {
                path: path.join(__dirname, 'build'),
                filename: '[name].[chunkhash].js'
            },
            plugins: [
                new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.[chunkhash].js'),
                new HtmlHashPlugin(plugin_options)
            ]
        }, done, path.join(__dirname, 'build', plugin_options.html_file));
    });
});