(function () {
  'use strict';

  /**
   * Add your stock data here. 'yid' is the yahoo id of the stock. Use http://finance.yahoo.com/q to find ids.
   */
  angular.module('stockViewer').value('StockData',
    [
      // yahoo as sample
      { yid: 'YHOO', amount: 42, buyingRate: 2313, buyingDate: new Date(2013, 0, 1) }
    ]
  );
})();