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
	this.Health = health;
	this.Weight = weight;
	this.State = SwooperState.SWOOP;
	this.moveRight = true;
	this.Color = '8844FF'
	let X = (Math.random() * 10) + 80;
	this.PosX = this.loc.X + X;
	this.NegX = this.loc.X - X;
	this.OrigY = this.loc.Y;
	this.OrigX = this.loc.X;
	this.Swoop = 0;
	this.SwoopMax = Math.random() * 10;
	this.PowerUp = false;
	if (Math.random() * 100 < 10)
	this.PowerUp = true;

	this.draw = function(ctx){
		if (this.Health <= 0)
			return;

		if (debugCollisions){
			ctx.strokeStyle = 'White';
			ctx.strokeRect(this.loc.X, this.loc.Y, this.loc.Width, this.loc.Height);
			return;
		}

		var drawX = this.loc.X + 25;
		var drawY = this.loc.Y;
		this.Color = WeightChart(this.Health);

		ctx.beginPath();
		ctx.moveTo(drawX - 25, drawY);
		ctx.lineTo(drawX, drawY + 10);
		ctx.lineTo(drawX + 25, drawY);
		ctx.lineTo(drawX - 25, drawY);
		ctx.closePath();
		ctx.fillStyle = this.Color;
		ctx.fill();
	}

	this.canShoot = function(){
		return this.readyToShoot;
	}

	this.move = function(){
		if (this.isDead())
			return;

		switch(this.State){
			case SwooperState.SWOOP:
				if (this.moveRight){
					if (this.loc.getX1() < this.PosX &&
						this.loc.getX1() < 500)
						this.loc.X += 5;
					else{
						this.moveRight = false;
						this.Swoop += 1;
					}
				}
				else{
					if (this.loc.X > this.NegX &&
						this.loc.X > 10)
						this.loc.X -= 5;
					else{
						this.moveRight = true;
						this.Swoop += 1;
					}
				}
				if(this.Swoop >= this.SwoopMax &&
					this.loc.X > this.OrigX - 10 &&
					this.loc.X < this.OrigX + 10){
					this.Swoop = 0;
					this.State = SwooperState.RUSH;
				}
				break;
			case SwooperState.RUSH:
				this.loc.Y += 15;
				if (this.loc.Y > this.OrigY + 300){
					this.OrigY += 100;
					if (this.loc.Y > 600)
						this.OrigY = 50;
					this.State = SwooperState.RETREAT;
				}
				break;
			case SwooperState.RETREAT:
				this.loc.Y -= 5;
				if (this.loc.Y <= this.OrigY)
					this.State = SwooperState.SWOOP;
				break;
			}
	}

	this.isDead = function(){
		if (this.Health <= 0)
			return true;
		
		return false;
	}
}

function demon(x, y, health, weight) {
	this.loc = new position(x, y, 20, 25);
	this.Health = health;
	this.Weight = weight;
	this.readyToShoot = false;
	this.isDead = false;
	this.PowerUp = false;
	if (Math.random() * 100 < 20)
		this.PowerUp = true;
	
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
			this.increment = (this.destination.X - this.loc.X) / 100;
		}
	}

	this.draw = function(ctx){
		if (this.Health <= 0)
			return;

		if (debugCollisions){
			ctx.strokeStyle = 'White';
			ctx.strokeRect(this.loc.X, this.loc.Y, this.loc.Width, this.loc.Height);
			return;
		}

		this.Color = WeightChart(this.Health);

		ctx.beginPath();
		ctx.moveTo(this.loc.X + this.loc.Width / 2, this.loc.Y);
		ctx.lineTo(this.loc.X + this.loc.Width, this.loc.Y + this.loc.Height / 2);
		ctx.lineTo(this.loc.X + this.loc.Width / 2, this.loc.Y + this.loc.Height);
		ctx.lineTo(this.loc.X, this.loc.Y + this.loc.Height / 2);
		ctx.closePath();
		ctx.fillStyle = this.Color;
		ctx.fill();
	}

	this.canShoot = function(){
		return this.readyToShoot;
	}

	this.isDead = function(){
		if (this.Health <= 0)
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
	this.Health = health;
	this.Weight = weight;
	this.State = PredatorState.WAIT;
	this.PowerUp = false;
	if (Math.random() * 100 < 20)
		this.PowerUp = true;

	this.proximity = 25;	
	let X = Math.random() * 500;
	let Y = Math.random() * 100;	
	this.destination = new position(X, Y, 0, 0);
	this.incrementX = (this.destination.X - this.loc.X) / 50;
	this.incrementY = (this.destination.Y - this.loc.Y) / 50;

	this.shotWait = 0;
	this.waitTime = 25;

	this.move = function(){
		if (this.isDead())
			return;

		switch(this.State){
			case PredatorState.SHOOT:
				// this.shotWait += 1;
				// if (this.shotWait >= this.waitTime){
				// 	this.shotWait = 0;
				// 	this.State = PredatorState.WAIT;
				// }
				break;
			case PredatorState.WAIT:
				this.shotWait += 1;
				if (this.shotWait >= this.waitTime){
					this.shotWait = 0;
					this.State = PredatorState.MOVE;
				}
				break;
			case PredatorState.MOVE:
				this.loc.X = this.incrementX + this.loc.X;
				this.loc.Y = this.incrementY + this.loc.Y;

				if (this.inProximityOfDestination() || this.isOutofBounds()){
					this.destination = this.getDestination();
					this.incrementX = (this.destination.X - this.loc.X) / 50;
					this.incrementY = (this.destination.Y - this.loc.Y) / 50;
					this.State = PredatorState.SHOOT;
					this.readyToShoot = true;
				}
				break;
		}
	}

	this.draw = function(ctx){
		if (this.Health <= 0)
			return;

		if (debugCollisions){
			ctx.strokeStyle = 'White';
			ctx.strokeRect(this.loc.X, this.loc.Y, this.loc.Width, this.loc.Height);
			return;
		}

		this.Color = WeightChart(this.Health);

		ctx.beginPath();
		ctx.moveTo(this.loc.centerX(), this.loc.Y);
		ctx.lineTo(this.loc.getX1(), this.loc.Y + this.loc.Height / 3);
		ctx.lineTo(this.loc.centerX(), this.loc.getY1());
		ctx.lineTo(this.loc.X, this.loc.Y + this.loc.Height / 3);
		ctx.closePath();
		ctx.fillStyle = this.Color;
		ctx.fill();
	}

	this.isDead = function(){
		if (this.Health <= 0)
			return true;
		
		return false;
	}

	this.canShoot = function(){
		if (this.State == PredatorState.SHOOT){
			return true;
		}
		return false;
	}

	this.getProjectile = function(playerLoc){
		this.State = PredatorState.WAIT;
		let speed = 50;
		let isWave = false;
		let X = this.loc.centerX();
		let Y = this.loc.centerY();

		let incrementX = (playerLoc.X - X) / 25;
		let incrementY = (playerLoc.Y - Y) / 25;

		let target = new position(playerLoc.X, playerLoc.Y, 0, 0)

		return new missile(X + incrementX, Y + incrementY, target, speed, this.Weight, isWave);
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