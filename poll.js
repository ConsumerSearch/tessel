// Gets the cumulative number of total requests from the site-pronto staging server

var fs = require('fs');
var sys = require('sys');
var http = require('http');
var exec = require('child_process').exec;

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
        fs.writeFile("data", JSON.stringify(count), function(err) {
          if(err) {
            console.log(err);
          } else {
            exec('sshpass -p timemachine scp data root@104.236.148.218:/tmp/',
              function (error, stdout, stderr) {
                console.log(error);
            });
          }
        }); 
      });
    }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
}, 5000);