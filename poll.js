// Gets the cumulative number of total requests from the site-pronto staging server

var http = require('http');

setInterval(function() {
  http.get("http://prontostg001iad.io.askjeeves.info:8001/metrics",
    function(res) {
      console.log("Got response: " + res.statusCode);
      var body = '';
      res.on('data', function(d) {
        body += d;
      });
      res.on('end', function() {
        var data = JSON.parse(body);
        var count = (data['site-pronto'].request.rate.count);
        console.log(count);
      });
    }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
}, 5000);
