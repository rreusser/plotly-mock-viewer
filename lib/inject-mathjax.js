'use strict';
var hyperstream = require('hyperstream');

module.exports = function () {
  return hyperstream({
    // Don't bother with local mathjax LOL.
    head: {
      _prependHtml: `
        <script type="text/javascript">
          window.MathJax = {
            root: 'https://plot.ly/static/js/plugins/mathjax',
            config: 'https://plot.ly/static/js/plugins/mathjax/config/TeX-AMS-MML_SVG.2b1f5dd083b6.js',
            extensions: ['Safe.js']
          };
        </script>
        <script type="text/javascript" src="https://plot.ly/static/js/plugins/mathjax/MathJax.11cd36db117e.js"></script>
      `
    }
  });
}
