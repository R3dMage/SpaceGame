winBackground = function(height, width){
	this.height = height;
	this.width = width;
	this.minAngle = -1.57;
	this.maxAngle = -0.9
	this.currentAngle = -1.57;
	this.increasing = true;

	this.initialize = function(){
	}

	this.draw = function(ctx){
		let gradient = ctx.createLinearGradient(0, 0, 650, 0);
		gradient.addColorStop(0, "rgba(128, 128, 0, 255)");
		gradient.addColorStop(1, "rgba(255, 255, 0, 0");
		ctx.fillStyle = gradient;
		ctx.save();
		ctx.translate(0, 750);
		ctx.rotate(this.currentAngle);
		ctx.fillRect(0, -50, 700, 100);
		ctx.restore();

		let diff = this.minAngle - this.currentAngle;
		ctx.save();
		ctx.translate(500, 750);
		ctx.rotate(this.minAngle + diff);
		ctx.fillRect(0, -50, 700, 100);
		ctx.restore();
	}

	this.move = function(delta){
		if (this.increasing){
			this.currentAngle += 0.01;
			if (this.currentAngle >= this.maxAngle)
				this.increasing = false;
			return;
		}

		this.currentAngle -= 0.01;
		if (this.currentAngle <= this.minAngle)
			this.increasing = true;
	}


}



rocket = function(x, y, direction){
	this.x = x;
	this.y = y;
	this.direction = direction;
	this.exploded = false;
	this.power = 50;
	this.particles = []

	this.draw = function(ctx){
		if (this.exploded){
			this.drawParticles(ctx);
		}
		ctx.fillStyle = "White";
		ctx.beginPath();
		ctx.arc(this.x, this.y, 5, 0, this.PI * 2);
		ctx.fill();
	}

	this.drawParticles = function(ctx){
		for(let i = 0; i < this.particles.length; i++){
			this.particles[i].draw(ctx);
		}
	}

	this.move = function(delta){
		if (this.exploded){
			this.moveParticles(delta);
			return;
		}

		this.x += Math.cos(this.direction) * this.power;
		this.y += Math.sin(this.direction) * this.power;
		this.power -= delta;

		if( this.power < 2)
			this.exploded = true;
	}

	this.moveParticles = function(delta){
		for(let i = 0; i < this.particles.length; i++){
			this.particles[i].move(delta);
		}
	}
}

particle = function(x, y, direction){
	this.x = x;
	this.y = y;
	this.power = 100;
	this.direction = direction;
	this.duration = 50;

	this.draw = function(ctx){
		ctx.strokeStyle = "White";
		ctx.beginPath();
		ctx.arc(this.x, this.y, 10, 0, this.PI * 2);
		ctx.stroke();
	}

	this.move = function(delta){
		this.x += Math.cos(this.direction) * this.power;
		this.y += Math.sin(this.direction) * this.power;
		this.power -= delta;
		this.duration -= delta;
	}
}