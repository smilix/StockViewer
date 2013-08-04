(function () {
  'use strict';

  var app = angular.module('stockViewer');

  // global setting
  var thouSep = '.';
  var decSep = ',';

  // created with this helpful example: http://polishinggems.blogspot.de/2011/03/enhancing-currency-filter-in-google.html
  app.filter('inEURO', [
    '$filter',
    function ($filter) {
      return function (input) {
        var curSymbol = ' €';
        var decPlaces = 2;

        // Check for invalid inputs
        var out = isNaN(input) || input === '' || input === null ? 0.0 : input;

        //Deal with the minus (negative numbers)
        var minus = input < 0;
        out = Math.abs(out) / 100;
        out = $filter('number')(out, decPlaces);

        // Replace the thousand and decimal separators.
        // This is a two step process to avoid overlaps between the two
        if (thouSep !== ',') out = out.replace(/\,/g, 'T');
        if (decSep !== '.') out = out.replace(/\./g, 'D');
        out = out.replace(/T/g, thouSep);
        out = out.replace(/D/g, decSep);

        // Add the minus and the symbol
        if (minus) {
          return '-' + out + curSymbol;
        } else {
          return out + curSymbol;
        }
      };
    }
  ]);

  app.filter('inPercent', [
    '$filter',
    function ($filter) {
      return function (input) {
        var out = isNaN(input) || input === '' || input === null ? 0.0 : input;

        //Deal with the minus (negative numbers)
        var minus = input < 0;
        out = Math.abs(out);
        out = $filter('number')(out, 2);

        // Replace the thousand and decimal separators.
        // This is a two step process to avoid overlaps between the two
        if (thouSep !== ',') out = out.replace(/\,/g, 'T');
        if (decSep !== '.') out = out.replace(/\./g, 'D');
        out = out.replace(/T/g, thouSep);
        out = out.replace(/D/g, decSep);

        // Add the minus and the symbol
        if (minus) {
          return '-' + out + '%';
        } else {
          return out + '%';
        }
      }
    }
  ]);
})();