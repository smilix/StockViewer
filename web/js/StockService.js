/**
 * Loads the stock data. Uses the yql (yahoo query language) as rest service to get the stocks.
 */

(function () {
  'use strict';

  angular.module('stockViewer').service('StockService', [
    '$log', '$q', '$http', 'StockData',
    function ($log, $q, $http, StockData) {

      function parseResult(deferred, data) {
        try {
          var stockData = data.query.results.quote;
          if (!angular.isArray(stockData)) {
            // for only one result, we don't get an array
            stockData = [ stockData ];
          }
          // convert float in string into integer cents
          stockData.forEach(function (stock) {
            ['LastTradePriceOnly', 'YearHigh', 'YearLow'].forEach(function (name) {
              stock[name] = Math.round(parseFloat(stock[name]) * 100);
            });
          });

          var fullData = StockData.map(function (baseData) {
            var current = findStockInResult(stockData, baseData.yid);
            return {
              base: baseData,
              current: current
            };
          });

          deferred.resolve({
            date: new Date(data.query.created),
            stocks: fullData
          });
        } catch (e) {
          $log.error('Failed parsing result data.', e);
          deferred.reject({
            error: e,
            data: data
          });
        }
      }

      function findStockInResult(result, symbol) {
        for (var i = 0; i < result.length; i++) {
          if (result[i].Symbol === symbol) {
            return result[i];
          }
        }
        throw new Error('Can´t find ' + symbol + ' in result.');
      }

      this.load = function () {
        $log.info('Loading stocks');


        var yqlBaseUrl = 'https://query.yahooapis.com/v1/public/yql?q={query}&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK';
        var queryTemplate = 'select Symbol, Name, LastTradePriceOnly, YearLow, YearHigh from yahoo.finance.quotes where symbol in ({symbols})';

        var yahooSymbols = StockData.map(function (stock) {
          return '"' + stock.yid + '"';
        }).join(',');

        var deferred = $q.defer();

        var query = queryTemplate.replace(/\{symbols\}/, yahooSymbols);
        var url = yqlBaseUrl.replace(/\{query\}/, query);
        $log.log('Requesting ', url);

//       debugging
//        parseResult(deferred, {"query": {"count": 7, "created": "2013-07-30T17:36:29Z", "lang": "en-US", "results": {"quote": [
//          {"YearLow": "28.30", "YearHigh": "35.795", "LastTradePriceOnly": "35.005", "Name": "CEWE COLOR HOLD", "Symbol": "CWC.DE"},
//          {"YearLow": "7.976", "YearHigh": "10.11", "LastTradePriceOnly": "9.224", "Name": "DEUTSCHE TELEKOM", "Symbol": "DTE.DE"},
//          {"YearLow": "50.82", "YearHigh": "65.00", "LastTradePriceOnly": "55.62", "Name": "SAP", "Symbol": "SAP.DE"},
//          {"YearLow": "111.75", "YearHigh": "158.65", "LastTradePriceOnly": "148.55", "Name": "MUNICHRE", "Symbol": "MUV2.DE"},
//          {"YearLow": "46.33", "YearHigh": "64.85", "LastTradePriceOnly": "55.82", "Name": "HANNOVER RUECK N", "Symbol": "HNR1.DE"},
//          {"YearLow": "35.145", "YearHigh": "53.95", "LastTradePriceOnly": "53.00", "Name": "DAIMLER N", "Symbol": "DAI.DE"},
//          {"YearLow": "77.76", "YearHigh": "122.10", "LastTradePriceOnly": "117.00", "Name": "ALLIANZ N", "Symbol": "ALV.DE"}
//        ]}}});
//        return deferred.promise;

        $http.jsonp(url)
          .success(function (data) {
            parseResult(deferred, data);
          })
          .error(function (data) {
            $log.error('Failed to load Stock data', data);
            deferred.reject({
              error: 'Failed loading.',
              data: data
            });
          });

        return deferred.promise;
      };


      return this;
    }]);
})();

