function player(){
// Drawing
	this.Wingspan = 8;
	
// Weaponry
	this.DualCannon = false;
	this.WeaponWeight = 1;
	this.readyToShoot = true;
	this.shotDelay = 10;
	this.laserEnergyMax = 100;
	this.laserEnergy = this.laserEnergyMax;
	this.maxRechargeDelay = 10;
	this.rechargeDelay = this.maxRechargeDelay;

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
		this.laserEnergy = this.laserEnergyMax;
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
		if (frameNumber > this.shotDelay && this.readyToShoot && !this.Exploding && this.laserEnergy > 10){
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
		this.rechargeDelay = 0;
	}

	this.getProjectiles = function(){
		let projectiles = [];
		let shotSpeed = 10;
		let target = new position(this.loc.X, -10, 0, 0);
		let offset = this.Wingspan;
		
		if(this.DualCannon){
			this.laserEnergy -= 20;
			target = new position(this.loc.X + 2, -10, 0, 0);
			projectiles.push(new missile(this.loc.X + 2, this.loc.Y, target, shotSpeed, this.WeaponWeight));
			target = new position(this.loc.X + 12, -10, 0, 0);
			projectiles.push(new missile(this.loc.X + 12, this.loc.Y, target, shotSpeed, this.WeaponWeight));
		}
		else{
			this.laserEnergy -= 10;
			projectiles.push(new missile(this.loc.X + offset, this.loc.Y, target, shotSpeed, this.WeaponWeight));
		}
		return projectiles;
	}

	this.update = function(){
		if(this.rechargeDelay < this.maxRechargeDelay)
			this.rechargeDelay += 1;

		if(this.laserEnergy < this.laserEnergyMax && this.rechargeDelay == this.maxRechargeDelay)
			this.laserEnergy += 1;
	}
}

function missile(x, y, target, speed, weight){
	this.loc = new position(x, y, 3, 9);
	this.target = target;
	this.weight = weight;
	this.speed = speed;
	this.direction = Math.atan2(target.Y - this.loc.Y, target.X - this.loc.X);

	this.Color = WeightChart(this.weight);

	this.draw = function(ctx){
		if (debugCollisions){
			ctx.strokeStyle = 'White';
			ctx.strokeRect(this.loc.X, this.loc.Y, this.loc.Width, this.loc.Height);
			return;
		}

		ctx.save();
		ctx.translate(this.loc.X, this.loc.Y);
		ctx.rotate(this.direction + Math.PI / 2);

		ctx.fillStyle = this.Color;
		ctx.fillRect(this.loc.Width / -2, this.loc.Height / -2, this.loc.Width, this.loc.Height);

		ctx.restore();
	}

	this.move = function(){
		this.loc.X += Math.cos(this.direction) * this.speed;
		this.loc.Y += Math.sin(this.direction) * this.speed;
	}

	this.endDuration = function(){
		if(this.loc.Y < -5 || this.loc.Y > 720 || this.loc.X < -5 || this.loc.X > 500)
			return true;

		return false;
	}
}