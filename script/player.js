function player(){
// Drawing
	this.Wingspan = 8;
	
// Weaponry
	this.DualCannon = false;
	this.WeaponWeight = 1;
	this.readyToShoot = true;
	this.shotDelay = 10;

// Shields
	this.Shields = 0;

// Player Damaged / Killed
	this.speed = 8;
	this.InvincibleTime = 0;
	this.Invincible = false;
	this.Exploding = false;
	this.ExplodeDistance = 0;
	this.loc = new position(212.5, 634, 16, 20);
	
	this.died = function(){
		this.DualCannon = false;
		this.WeaponWeight = 1;
		this.Shields = 0;
	}
	
	this.setPosition = function(x, y){
		if(!this.Exploding){
			if(x < 0)
				x = 0;
			else if( x > 500 - (this.Wingspan * 2))
				x = 500 - (this.Wingspan * 2);
			
			if(y < 0)
				y = 0;
			if(y > 720 - this.loc.Height)
				y = 720 - this.loc.Height;
				
			this.loc.X = x;
			this.loc.Y = y;
		}
	}

	this.canShoot = function(frameNumber){
		if (frameNumber > this.shotDelay && this.readyToShoot && !this.Exploding){
			this.readyToShoot = false;
			return true;
		}

	}
	
	this.getMissileType = function(){		
		if(this.DualCannon)
			return 'DUAL';
		
		return 'SINGLE';
	}
	
	this.draw = function(ctx){
		if(debugCollisions){
			ctx.strokeStyle = 'White';
			ctx.strokeRect(this.loc.X, this.loc.Y, this.loc.Width, this.loc.Height);
			return;
		}

		let drawX = this.loc.X + this.Wingspan;
		let drawY = this.loc.Y;
		try {
			if(!this.Exploding){
				ctx.beginPath();
				ctx.moveTo(drawX, drawY);
				ctx.lineTo(drawX - this.Wingspan, drawY + 20);
				ctx.lineTo(drawX, drawY + 15);
				ctx.lineTo(drawX + this.Wingspan, drawY + 20);
				ctx.lineTo(drawX, drawY);
				ctx.closePath();
				if(this.Invincible){
					let alpha = 255;
					if(this.InvincibleTime % 2 == 0)
						alpha = 0;
					ctx.fillStyle = 'rgba(142,214,255,' + alpha + ')';
					this.InvincibleTime += 1;
					if(this.InvincibleTime >= 100){
						this.InvincibleTime = 0;
						this.Invincible = false;
					}
				}
				else
					ctx.fillStyle = 'rgba(142,214,255,255)';
				ctx.fill();
				if( this.Shields > 0 )
					this.drawShields(ctx);
			}
			else{
				this.ExplodeDistance += 0.5;
				ctx.beginPath();
				ctx.moveTo(drawX, this.loc.Y);
				ctx.arc(drawX, this.loc.Y, this.ExplodeDistance, 2 * Math.PI, false);
				if(this.ExplodeDistance % 2 == 0)
					ctx.fillStyle = 'rgba(255, 255, 255, 1)';
				else
					ctx.fillStyle = 'rgba(255, 255, 0, 1)';
				ctx.fill();
				if (this.ExplodeDistance >= 40){
					this.ExplodeDistance = 0;
					this.Exploding = false;
					this.loc.X = 250;
					this.loc.Y = 634;
				}
			}
		}
		catch (e){
		}
	}
	
	this.drawShields = function(ctx){
		let ShieldRadius = 0;
		if( this.loc.Width > this.loc.Height )
			ShieldRadius = this.loc.Width;
		else
			ShieldRadius = this.loc.Height;
		
		ctx.strokeStyle = WeightChart(this.Shields);
		ctx.beginPath();
		ctx.arc(this.loc.X + this.Wingspan, this.loc.Y + this.loc.Height/2, ShieldRadius, 2 * Math.PI, false);
		ctx.closePath();
		ctx.stroke();
	}

	this.moveLeft = function(){
		this.setPosition(this.loc.X - this.speed, this.loc.Y);
	}

	this.moveRight = function(){
		this.setPosition(this.loc.X + this.speed, this.loc.Y);
	}

	this.moveUp = function(){
		this.setPosition(this.loc.X, this.loc.Y - this.speed);
	}

	this.moveDown = function(){
		this.setPosition(this.loc.X, this.loc.Y + this.speed);
	}

	this.resetShootDelay = function(){
		this.readyToShoot = true;
	}

	this.getProjectiles = function(){
		let projectiles = [];
		let shotSpeed = 50;
		let target = new position(this.loc.X, -10, 0, 0);
		let offset = this.Wingspan;
		
		if(this.DualCannon){
			target = new position(this.loc.X + 2, -10, 0, 0);
			projectiles.push(new missile(this.loc.X + 2, this.loc.Y, target, shotSpeed, this.WeaponWeight));
			target = new position(this.loc.X + 12, -10, 0, 0);
			projectiles.push(new missile(this.loc.X + 12, this.loc.Y, target, shotSpeed, this.WeaponWeight));
		}
		else{
			projectiles.push(new missile(this.loc.X + offset, this.loc.Y, target, shotSpeed, this.WeaponWeight));
		}
		return projectiles;
	}
}

function missile(x, y, target, speed, weight){
	this.loc = new position(x, y, 3, 9);
	this.target = target;
	this.weight = weight;
	this.speed = speed;
	this.incrementX = (target.X - this.loc.X) / speed;
	this.incrementY = (target.Y - this.loc.Y) / speed;
	this.alive = true;

	this.Color = WeightChart(this.weight);

	this.draw = function(ctx){
		if (debugCollisions){
			ctx.strokeStyle = 'White';
			ctx.strokeRect(this.loc.X, this.loc.Y, this.loc.Width, this.loc.Height);
			return;
		}

		ctx.save();
		ctx.translate(this.loc.X, this.loc.Y);
		ctx.rotate(Math.atan2(this.target.Y - this.loc.Y, this.target.X - this.loc.X) + Math.PI / 2);

		ctx.fillStyle = this.Color;
		ctx.fillRect(this.loc.Width / -2, this.loc.Height / -2, this.loc.Width, this.loc.Height);

		ctx.restore();
	}

	this.move = function(){
		this.loc.X += this.incrementX;
		this.loc.Y += this.incrementY;
	}

	this.endDuration = function(){
		if(this.loc.Y < -5 || this.loc.Y > 720 || this.loc.X < -5 || this.loc.X > 500)
			return true;

		return false;
	}
}