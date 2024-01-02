var SwooperState = {
	SWOOP   :  0,
	RUSH    :  1,
	RETREAT :  2};

var PredatorState = {
	SHOOT :0,
	WAIT  :1,
	MOVE  :2};
	
function swooper(x, y, health, weight){
	this.loc = new position(x, y, 40, 15);
	this.readyToShoot = false;
	this.health = health;
	this.weight = weight;
	this.state = SwooperState.SWOOP;
	this.moveRight = true;
	this.color = '8844FF'
	let randomX = (Math.random() * 10) + 80;
	this.posX = this.loc.X + randomX;
	this.negX = this.loc.X - randomX;
	this.origY = this.loc.Y;
	this.origX = this.loc.X;
	this.swoop = 0;
	this.swoopMax = Math.random() * 10;

	this.draw = function(ctx){
		if (this.health <= 0)
			return;

		if (debugCollisions){
			ctx.strokeStyle = 'White';
			ctx.strokeRect(this.loc.X, this.loc.Y, this.loc.Width, this.loc.Height);
			return;
		}

		var drawX = this.loc.X + 25;
		var drawY = this.loc.Y;
		this.color = WeightChart(this.health);

		ctx.beginPath();
		ctx.moveTo(drawX - 25, drawY);
		ctx.lineTo(drawX, drawY + 10);
		ctx.lineTo(drawX + 25, drawY);
		ctx.lineTo(drawX - 25, drawY);
		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();
	}

	this.canShoot = function(){
		return this.readyToShoot;
	}

	this.move = function(){
		if (this.isDead())
			return;

		switch(this.state){
			case SwooperState.SWOOP:
				if (this.moveRight){
					if (this.loc.getX1() < this.posX &&
						this.loc.getX1() < 500)
						this.loc.X += 5;
					else{
						this.moveRight = false;
						this.swoop += 1;
					}
				}
				else{
					if (this.loc.X > this.negX &&
						this.loc.X > 10)
						this.loc.X -= 5;
					else{
						this.moveRight = true;
						this.swoop += 1;
					}
				}
				if(this.swoop >= this.swoopMax &&
					this.loc.X > this.origX - 10 &&
					this.loc.X < this.origX + 10){
					this.swoop = 0;
					this.state = SwooperState.RUSH;
				}
				break;
			case SwooperState.RUSH:
				this.loc.Y += 15;
				if (this.loc.Y > this.origY + 300){
					this.origY += 100;
					if (this.loc.Y > 600)
						this.origY = 50;
					this.state = SwooperState.RETREAT;
				}
				break;
			case SwooperState.RETREAT:
				this.loc.Y -= 5;
				if (this.loc.Y <= this.origY)
					this.state = SwooperState.SWOOP;
				break;
			}
	}

	this.isDead = function(){
		if (this.health <= 0)
			return true;
		
		return false;
	}
}

function demon(x, y, health, weight) {
	this.loc = new position(x, y, 20, 25);
	this.health = health;
	this.weight = weight;
	this.readyToShoot = false;
	this.isDead = false;
	
	this.proximity = 25;	
	let X = Math.random() * 500;
	let Y = Math.random() * 500;	
	this.destination = new position(X, Y, 0, 0);
	this.slope = (this.destination.Y - this.loc.Y) / (this.destination.X - this.loc.X);
	this.increment = (this.destination.X - this.loc.X) / 50;

	this.move = function(){
		if (this.isDead())
			return;

		//let increment = (this.destination.X - this.loc.X) / 50;
		this.loc.X = this.increment + this.loc.X;
		this.loc.Y = this.loc.Y + this.slope * this.increment;

		if (this.inProximityOfDestination() || this.isOutofBounds()){
			this.destination = this.getDestination();
			this.slope = (this.destination.Y - this.loc.Y) / (this.destination.X - this.loc.X);
			this.increment = (this.destination.X - this.loc.X) / 50;
		}
	}

	this.draw = function(ctx){
		if (this.health <= 0)
			return;

		if (debugCollisions){
			ctx.strokeStyle = 'White';
			ctx.strokeRect(this.loc.X, this.loc.Y, this.loc.Width, this.loc.Height);
			return;
		}

		this.color = WeightChart(this.health);

		ctx.beginPath();
		ctx.moveTo(this.loc.X + this.loc.Width / 2, this.loc.Y);
		ctx.lineTo(this.loc.X + this.loc.Width, this.loc.Y + this.loc.Height / 2);
		ctx.lineTo(this.loc.X + this.loc.Width / 2, this.loc.Y + this.loc.Height);
		ctx.lineTo(this.loc.X, this.loc.Y + this.loc.Height / 2);
		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();
	}

	this.canShoot = function(){
		return this.readyToShoot;
	}

	this.isDead = function(){
		if (this.health <= 0)
			return true;
		
		return false;
	}

	this.getDestination = function(){
		let X = Math.random() * 500;
		if (X < 10)
			X = 10;
		else if (X > 490)
			X = 490;
		let Y = Math.random() * 700;
		if (Y < 10)
			Y = 10;
		else if (Y > 700)
			Y = 700;
		return new position(X, Y, 0, 0);
	}

	this.isOutofBounds = function(){
		if (this.loc.X < 0 || this.loc.X > 500 || this.loc.Y < 0 || this.loc.Y > 700)
			return true;
		
		return false;
	}

	this.inProximityOfDestination = function(){
		if (this.loc.X - this.destination.X < this.proximity && this.loc.Y - this.destination.Y < this.proximity)
			return true;
		
		return false;
	}
}

function predator (x, y, health, weight) {
	this.loc = new position(x, y, 20, 25);
	this.health = health;
	this.weight = weight;
	this.state = PredatorState.WAIT;

	this.proximity = 25;	
	let randomX = Math.random() * 500;
	let randomY = Math.random() * 100;	
	this.destination = new position(randomX, randomY, 0, 0);
	this.incrementX = (this.destination.X - this.loc.X) / 50;
	this.incrementY = (this.destination.Y - this.loc.Y) / 50;

	this.shotWait = 0;
	this.waitTime = 25;

	this.move = function(){
		if (this.isDead())
			return;

		switch(this.state){
			case PredatorState.SHOOT:
				// this.shotWait += 1;
				// if (this.shotWait >= this.waitTime){
				// 	this.shotWait = 0;
				// 	this.state = PredatorState.WAIT;
				// }
				break;
			case PredatorState.WAIT:
				this.shotWait += 1;
				if (this.shotWait >= this.waitTime){
					this.shotWait = 0;
					this.state = PredatorState.MOVE;
				}
				break;
			case PredatorState.MOVE:
				this.loc.X = this.incrementX + this.loc.X;
				this.loc.Y = this.incrementY + this.loc.Y;

				if (this.inProximityOfDestination() || this.isOutofBounds()){
					this.destination = this.getDestination();
					this.incrementX = (this.destination.X - this.loc.X) / 50;
					this.incrementY = (this.destination.Y - this.loc.Y) / 50;
					this.state = PredatorState.SHOOT;
					this.readyToShoot = true;
				}
				break;
		}
	}

	this.draw = function(ctx){
		if (this.health <= 0)
			return;

		if (debugCollisions){
			ctx.strokeStyle = 'White';
			ctx.strokeRect(this.loc.X, this.loc.Y, this.loc.Width, this.loc.Height);
			return;
		}

		this.color = WeightChart(this.health);

		ctx.beginPath();
		ctx.moveTo(this.loc.centerX(), this.loc.Y);
		ctx.lineTo(this.loc.getX1(), this.loc.Y + this.loc.Height / 3);
		ctx.lineTo(this.loc.centerX(), this.loc.getY1());
		ctx.lineTo(this.loc.X, this.loc.Y + this.loc.Height / 3);
		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();
	}

	this.isDead = function(){
		if (this.health <= 0)
			return true;
		
		return false;
	}

	this.canShoot = function(){
		if (this.state == PredatorState.SHOOT){
			return true;
		}
		return false;
	}

	this.getProjectile = function(playerLoc){
		this.state = PredatorState.WAIT;
		let speed = 15;
		let X = this.loc.centerX();
		let Y = this.loc.centerY();

		let incrementX = (playerLoc.X - X) / 25;
		let incrementY = (playerLoc.Y - Y) / 25;

		let target = new position(playerLoc.X, playerLoc.Y, 0, 0)

		return new missile(X + incrementX, Y + incrementY, target, speed, this.weight);
	}

	this.getDestination = function(){
		let newDestination = this.destination;
		while(this.distanceFromPoint(newDestination.X, newDestination.Y) < this.proximity){
			let randomX = Math.random() * 500;
		if (randomX < 10)
			randomX = 10;
		else if (randomX > 490)
			randomX = 490;
		let randomY = Math.random() * 700;
		if (randomY < 10)
			randomY = 10;
		else if (randomY > 700)
			randomY = 700;

		newDestination = new position(randomX, randomY, 0, 0);
		}
		
		return newDestination;
	}

	this.isOutofBounds = function(){
		if (this.loc.X < 0 || this.loc.X > 500 || this.loc.Y < 0 || this.loc.Y > 700)
			return true;
		
		return false;
	}

	this.inProximityOfDestination = function(){
		if (this.distanceFromPoint(this.destination.X, this.destination.Y) < this.proximity)
			return true;
		
		return false;
	}

	this.distanceFromPoint = function(x, y){
		let distance = Math.sqrt(Math.pow(this.loc.X - x, 2) + Math.pow(this.loc.Y - y, 2));
		return distance;
	}
}