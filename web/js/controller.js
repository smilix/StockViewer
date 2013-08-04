(function () {
  'use strict';

  var app = angular.module('stockViewer');

  app.controller('MainCtrl', [
    '$scope', '$log', '$window', 'StockService', 'Config',
    function ($scope, $log, $window, StockService, Config) {

      $scope.data = {
        stocks: [],
        lastUpdated: '...',
        loadingState: 'loading',
        errorEmail: ''
      };

      $scope.print = function () {
        $window.print();
      };

      StockService.load().then(
        function success(stockData) {
          console.log('success:', stockData);
          $scope.data.stocks = stockData.stocks;
          $scope.data.lastUpdated = stockData.date;
          $scope.data.loadingState = 'finished';
        },
        function error(data) {
          $scope.data.loadingState = 'error';
          var subject = 'Fehler in StockViewer';
          var body = 'Hallo Holger,\n\nder folgende Fehler ist aufgetreten: '
            + data.error + '\nDaten: ' + angular.toJson(data) + '\n\n------------\n';
          $scope.data.errorEmail = 'mailto:' + Config.mail + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        });
    }
  ]);

  app.controller('TableCtrl', [
    '$scope',
    function ($scope) {
      $scope.sumInvest = 0;
      $scope.sumDepotValue = 0;
      $scope.sumWinAbs = 0;
      $scope.sumWinPercent = 0;
      $scope.sumwinClass = '';

      $scope.updateTotal = function (invest, valueNow) {
        $scope.sumInvest += invest;
        $scope.sumDepotValue += valueNow;
        $scope.sumWinAbs += (valueNow - invest);

        $scope.sumWinPercent = 100 / $scope.sumInvest * $scope.sumDepotValue - 100;
        $scope.sumWinClass = $scope.sumWinAbs >= 0 ? 'positive' : 'negative';
      };
    }
  ]);

  app.controller('StockLoopCtrl', [
    '$scope',
    function ($scope) {

      var b = $scope.stock.base;
      var c = $scope.stock.current;
      var invest = b.amount * b.buyingRate;
      var valueNow = b.amount * c.LastTradePriceOnly;

      $scope.updateTotal(invest, valueNow);

      $scope.name = c.Name;
      $scope.link = 'http://de.finance.yahoo.com/q?s=' + b.yid;
      $scope.buyingDate = b.buyingDate;
      $scope.symbol = b.yid;
      $scope.amount = b.amount;
      $scope.buyingRate = b.buyingRate;
      $scope.invest = invest;
      $scope.rate = c.LastTradePriceOnly;
      $scope.yearLow = c.YearLow;
      $scope.yearHigh = c.YearHigh;
      $scope.winAbs = valueNow - invest;
      $scope.winPercent = 100 / invest * valueNow - 100;
      $scope.depotValue = valueNow;
      $scope.winClass = $scope.winAbs >= 0 ? 'positive' : 'negative';
    }
  ]);
})();