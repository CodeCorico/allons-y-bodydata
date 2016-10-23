module.exports = function() {
  'use strict';

  DependencyInjection.service('$BodyDataService', ['$AbstractService', function($AbstractService) {

    return new (function BodyDataService() {

      $AbstractService.call(this);

      var _data = {},
          _$body = this.isNode() ? null : $('body');

      this.data = this.methodFrontBack(function(name, value) {
        if (name) {
          if (typeof value != 'undefined') {
            _$body.data(name, value);
          }

          return _$body.data(name);
        }

        return _$body.data();
      }, function(req, name, value) {
        var id = req ? req.id : 'all';
        _data[id] = _data[id] || {};

        if (name) {
          if (typeof value != 'undefined') {
            _data[id][name] = value;
          }

          return _data[id][name];
        }

        return _data[id];
      });

      this.inject = function(req, html) {
        var extend = require('extend'),
            dataAttributes = [],
            data = extend(true, {}, _data.all);

        if (req && _data[req.id]) {
          extend(true, data, _data[req.id]);

          delete _data[req.id];
        }

        Object.keys(data).forEach(function(name) {
          dataAttributes.push('data-' + name + '=\'' + JSON.stringify(data[name]).replace(/'/g, '\\\'') + '\'');
        });

        return html.replace(/(<body.*?>)/, function(text) {
          return text.substr(0, text.length - 1) + (dataAttributes.length ? ' ' + dataAttributes.join(' ') : '') + '>';
        });
      };

    })();

  }]);

};
