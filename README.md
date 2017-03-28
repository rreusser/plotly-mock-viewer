# plotly-mock-viewer

<img src="./screenshot.png" width="400">

## Introduction

A budo-based live-reloading standalone viewer for plotly mocks. Advantages:

- refetches mock list on each reload (no need to restart server when mock files move around)
- live reload (devtools server was slow to compile and threw error more often than not as a result when reloading)
- Detailed JSON error messages that propagate to the browser console 🎉

To use:

```bash
$ npm i -g plotly-mock-viewer
```

And then from within your local plotly.js directory:

```
$ cd /path/to/my/local/plotly.js
$ plotly-mock-viewer
```

## License

Includes source of MIT-licensed [`JavaScript-autoComplete`](https://github.com/Pixabay/JavaScript-autoComplete)

&copy; 2017 Ricky Reusser. MIT License.
