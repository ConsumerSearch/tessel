/*  This script runs tessel relay switch in a loop to read a file (containing
 *  cumulative total number of requests on the Pronto Staging Server every 5 seconds)
 *  from the document root in a publicly accessible Virtual Private Server
 *  and toggle lights ON if the traffic on site Pronto is above a threshold limit
 *  and OFF if the traffic on site Pronto is below the threshold limit
 */

var http = require('http');
var count = 0;
var threshold = 5;

var tessel = require('tessel');
var relaylib = require('relay-mono');
var relay = relaylib.use(tessel.port['B']);

http.get("http://104.236.148.218/data",
  function(res) {
    console.log("Got response: " + res.statusCode);
    var body = '';
    res.on('data', function(d) {
      body += d;
    });
    res.on('end', function() {
      count = body.trim();
      console.log(count);
    });
  }).on('error', function(e) {
  console.log("Got error: " + e.message);
});

relay.on('ready', function relayReady() {
  setInterval(function() {
    http.get("http://104.236.148.218/data",
      function(res) {
        console.log("Got response: " + res.statusCode);
        var body = '';
        res.on('data', function(d) {
          body += d;
        });
        res.on('end', function() {
          delta = count - Number(body.trim());
          relay.on('latch', function(channel, value) {
            if (delta > threshold) {
              if (!value) {
                relay.toggle(2, function toggleTwoResult(err) {
                  if (err) {
                    console.log("Err toggling 2", err);
                  }
                });
              }
            } else {
              if (value) {
                relay.toggle(2, function toggleTwoResult(err) {
                  if (err) {
                    console.log("Err toggling 2", err);
                  }
                });
              }
            }
          });
        });
      }).on('error', function(e) {
      console.log("Got error: " + e.message);
    });
  }, 5000);
}); * /
