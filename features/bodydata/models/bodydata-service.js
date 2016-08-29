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
      }, function(name, value) {
        if (name) {
          if (typeof value != 'undefined') {
            _data[name] = value;
          }

          return _data[name];
        }

        return _data;
      });

      this.inject = function(html) {
        var dataAttributes = [];

        Object.keys(_data).forEach(function(name) {
          dataAttributes.push('data-' + name + '=\'' + JSON.stringify(_data[name]).replace(/'/g, '\\\'') + '\'');
        });

        return html.replace(/(<body.*?>)/, function(text) {
          return text.substr(0, text.length - 1) + (dataAttributes.length ? ' ' + dataAttributes.join(' ') : '') + '>';
        });
      };

    })();

  }]);

};
