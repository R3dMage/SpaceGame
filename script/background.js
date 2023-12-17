
background = function(numberOfCircles, height, width){
	this.height = height;
	this.width = width;
	this.howManyCircles = numberOfCircles;
	this.circles = [];
		
	this.initCircles = function(){
		for(let i = 0; i < this.howManyCircles; i++)
			this.circles.push([Math.random() * width, Math.random() * height,
			Math.random() * 100, Math.random() / 2, Math.random() * 10]);
		//add information about circles into  
		//the 'circles' Array. It is x & y positions,   
		//radius from 0-100 and transparency   
		//from 0-0.5 (0 is invisible, 1 no transparency)
	}

	this.drawCircles = function(ctx){
		for (let i = 0; i < this.howManyCircles; i++){
			ctx.fillStyle = 'rgba(255, 255, 255, ' + this.circles[i][3] + ')';
			ctx.beginPath();
			ctx.arc(this.circles[i][0], this.circles[i][1], this.circles[i][2], 0, Math.PI * 2, true);
			// arc(x, y, radius, startAngle, endAngle, anticlockwise)
			// circle always has PI*2 end angle
			
			ctx.closePath();
			ctx.fill();
		}
	}

	this.moveCircles = function(deltaY){
		for (let i = 0; i < this.howManyCircles; i++){
			if (this.circles[i][1] - this.circles[i][2] > this.height){
				this.circles[i][0] = Math.random() * this.width;
				this.circles[i][2] = Math.random() * 100;
				this.circles[i][1] = 0 - this.circles[i][2];
				this.circles[i][3] = Math.random() / 2;
			}
			else{
				this.circles[i][1] += (deltaY + this.circles[i][4]);
			}
		}
	}
};