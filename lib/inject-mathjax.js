'use strict';
var hyperstream = require('hyperstream');

module.exports = function (local) {
  if (local) {
    return hyperstream({
      head: {
        _appendHtml: `
          <script type="text/javascript" src="/mathjax/MathJax.js"></script>
          <script type="text/javascript">
            MathJax.Hub.Config({
                jax: ['input/TeX', 'output/SVG']
            })
          </script>
        `
      }
    });
  } else {
    return hyperstream({
      head: {
        _appendHtml: '<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS-MML_SVG"></script>'
      }
    });
  }
}
