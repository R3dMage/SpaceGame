var initCircles = function(){
	for(var i = 0; i < howManyCircles; i++)
		circles.push([Math.random() * width, Math.random() * height,
		Math.random() * 100, Math.random() / 2, Math.random() * 10]);
	  //add information about circles into  
	  //the 'circles' Array. It is x & y positions,   
	  //radius from 0-100 and transparency   
	  //from 0-0.5 (0 is invisible, 1 no transparency)
}

var DrawCircles = function(){
  for (var i = 0; i < howManyCircles; i++){
    ctx.fillStyle = 'rgba(255, 255, 255, ' + circles[i][3] + ')';
	ctx.beginPath();
	ctx.arc(circles[i][0], circles[i][1], circles[i][2], 0, Math.PI * 2, true);
	// arc(x, y, radius, startAngle, endAngle, anticlockwise)
	// circle always has PI*2 end angle
	
	ctx.closePath();
	ctx.fill();
	}
};

var MoveCircles = function(deltaY){
  for (var i = 0; i < howManyCircles; i++){
    if (circles[i][1] - circles[i][2] > height){
	  circles[i][0] = Math.random() * width;
	  circles[i][2] = Math.random() * 100;
	  circles[i][1] = 0 - circles[i][2];
	  circles[i][3] = Math.random() / 2;
	}
	else{
	  circles[i][1] += (deltaY + circles[i][4]);
	}
  }
};