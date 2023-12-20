
background = function(numberOfCircles, height, width){
	this.height = height;
	this.width = width;
	this.howManyCircles = numberOfCircles;
	this.circles = [];
		
	this.initialize = function(){
		for(let i = 0; i < this.howManyCircles; i++)
			this.circles.push(
			new star(Math.random() * this.width, Math.random() * this.height, Math.random() * 5, this.getTransparency(), Math.random() * 10));
	}

	this.draw = function(ctx){
		for (let i = 0; i < this.howManyCircles; i++){
			this.circles[i].draw(ctx);
		}
	}

	this.move = function(deltaY){
		for (let i = 0; i < this.howManyCircles; i++){
			if (this.circles[i].y - this.circles[i].radius > this.height){
				this.circles[i].x = Math.random() * this.width;
				this.circles[i].radius = Math.random() * 5;
				this.circles[i].y = 0 - this.circles[i].radius;
				this.circles[i].transparency = this.getTransparency();
			}
			else{
				this.circles[i].y += (deltaY + this.circles[i].speed);
			}
		}
	}

	this.getTransparency = function(){
		return Math.random() / 4;
	}
};

star = function(x, y, radius, transparency, speed){
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.transparency = transparency;
	this.speed = speed;

	this.draw = function(ctx){
		ctx.fillStyle = 'rgba(255, 255, 0, ' + this.transparency + ')';
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();
	}
}