# plotly-mock-viewer

<img src="./screenshot.png" width="400">

## Introduction

A budo-based live-reloading standalone viewer for plotly mocks. Advantages:

- refetches mock list on each reload (no need to restart server when mock files move around)
- live reload (devtools server was slow to compile and threw error more often than not as a result when reloading)
- Detailed JSON error messages that propagate to the browser console 🎉
- [Deployed to the web](http://rreusser.github.io/plotly-mock-viewer/) using plotly@latest
- Specify CDN version on the command line for quick comparison

## Installation

```bash
$ npm i -g plotly-mock-viewer
```

## Usage

From within your local plotly.js directory it functions as a live-reloading dev server:

```
$ cd /path/to/my/local/plotly.js
$ plotly-mock-viewer
```

If you want to use a particular CDN version of plotly.js instead, you can provide that as an argument:

```
$ plotly-mock-viewer -s https://cdn.plot.ly/plotly-1.20.0.js
```

Which is equivalent to

```
$ plotly-mock-viewer -v 1.20.0
```

You can also load a local mock directly (remote url = todo):

```bash
$ plotly-mock-viewer local-mock.json
```

The full list of command line options is:

```
Usage: plotly-mock-viewer [plot json] {OPTIONS}

Options:

             --latest, -l  Use plotly.js latest version from CDN

            --version, -v  Use a specific version of plotly.js from CDN

       --remote-mocks, -r  Use mocks from github.com/plotly/plotly.js master branch

               --help, -h  Display this message

--mapbox-access-token, -m  Specify a mapbox access token

         --plotly-src, -s  A local or remote plotly src url

         --plotly-dir, -p  A path to the local plotly directory (by default, looks
                           upward to the nearest package.json)

           --mock-dir, -d  A path to the directory containing mocks (by default,
                           test/image/mocks relative to the plotly directory)

     -remote-topojson, -t  Use topojson from cdn.plot.ly (by default,
                           dist/topojson relative to the plotly directory)

            --mathjax, -j  Load MathJax

          --keep-meta, -k  Skip metadata-stripping browserify transform to enable
                           inspection of the plot schema with metadata

```

## Development

`plotly.js` is a dev dependency only. So that you can develop the viewer itself, you can start the server using the dev version of plotly.js with:

```
$ npm start
```

## License

Includes source of MIT-licensed [`JavaScript-autoComplete`](https://github.com/Pixabay/JavaScript-autoComplete)

&copy; 2017 Ricky Reusser. MIT License.
