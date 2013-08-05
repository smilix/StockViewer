# StockViewer

A simple stock viewer with print function.

## Installation

1. Clone this repo
2. Create the ```config.js``` and ```StockData.js``` in the  ```web/js/``` directory. Use their ```-sample.js``` version as example.
3. Copy the content of the ```web``` folder on a webserver
4. Done!

## Implementation details

### Data source
I'm using the Yahoo Query Language to fetch the stock data. You can make some tests here http://developer.yahoo.com/yql/console/ .

Sometimes the source above fails, because of too many requests (not by me, of course). Maybe I will use one of the following alternatives

* http://jsfiddle.net/grimreaper01/jVWwu/
* https://www.google.com/finance

### Frontend
Angluarjs with Twitter Bootstrap styling.

### Backend
No special backend needed, use a static web server.

## TODO
* jshint

