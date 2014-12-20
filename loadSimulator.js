var exec = require('child_process').exec;
  var increase = false;
  var setBlinking = function(time, cap){
  	if (time < 0){
  		increase = true;
  	}
  	if (time > cap){
  		increase = false;
  	}
	setTimeout(function(){
		exec('curl http://prontostg001iad.io.askjeeves.info/?qsrc=9',
	  		function (error, stdout, stderr) {
		});
		if (increase){
			time += 50;
		}
		else{
			time -= 50;
		}
		setBlinking(time, cap);
	}, time);
  };
  setBlinking(2000, 2000);