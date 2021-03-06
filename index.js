var loaderUtils = require("loader-utils");

module.exports = function(content) {
  this.cacheable && this.cacheable();
  var options = loaderUtils.getOptions(this);

  var match = content.match(/<svg([^>]+)+>([\s\S]+)<\/svg>/i);
  var attrs = {};

  if (match) {
    attrs = match[1];
    if (attrs) {
      attrs = attrs.match(/([\w-:]+)(=)?("[^<>"]*"|'[^<>']*'|[\w-:]+)/g)
        .reduce(function(obj, attr){
          var split = attr.split('=');
          var name = split[0];
          var value = true;
          if (split && split[1]) {
            value = split[1].replace(/['"]/g, '');
          }
          obj[name] = value;
          return obj;
        }, {})
    }

    content = match[2] || '';
  };

  content = content.replace(/\n/g, ' ').trim();
  this.value = content;

  if (typeof options === 'object' && typeof options.transformAttributes === 'function') {
    var attrs = options.transformAttributes(attrs);
  }

	return "module.exports = " + JSON.stringify({attributes: attrs, content: content});
}
module.exports.seperable = true;