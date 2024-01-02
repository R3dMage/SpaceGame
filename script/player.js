function player(){
// Drawing
	this.wingspan = 8;
	
// Weaponry
	this.dualCannon = false;
	this.weaponWeight = 1;
	this.readyToShoot = true;
	this.shotDelay = 10;
	this.laserEnergyMax = 100;
	this.laserEnergy = this.laserEnergyMax;
	this.maxRechargeDelay = 10;
	this.rechargeDelay = this.maxRechargeDelay;

// Shields
	this.shields = 0;

// Player Damaged / Killed
	this.speed = 8;
	this.invincibleTime = 0;
	this.invincible = false;
	this.exploding = false;
	this.explodeDistance = 0;
	this.loc = new position(212.5, 634, 16, 20);
	
	this.died = function(){
		this.dualCannon = false;
		this.weaponWeight = 1;
		this.shields = 0;
		this.laserEnergy = this.laserEnergyMax;
	}
	
	this.setPosition = function(x, y){
		if(!this.exploding){
			if(x < 0)
				x = 0;
			else if( x > 500 - (this.wingspan * 2))
				x = 500 - (this.wingspan * 2);
			
			if(y < 0)
				y = 0;
			if(y > 720 - this.loc.Height)
				y = 720 - this.loc.Height;
				
			this.loc.X = x;
			this.loc.Y = y;
		}
	}

	this.canShoot = function(frameNumber){
		if (frameNumber > this.shotDelay && this.readyToShoot && !this.exploding && this.laserEnergy > 10){
			this.readyToShoot = false;
			return true;
		}

	}
	
	this.getMissileType = function(){
		if(this.dualCannon)
			return 'DUAL';
		
		return 'SINGLE';
	}
	
	this.draw = function(ctx){
		if(debugCollisions){
			ctx.strokeStyle = 'White';
			ctx.strokeRect(this.loc.X, this.loc.Y, this.loc.Width, this.loc.Height);
			return;
		}

		let drawX = this.loc.X + this.wingspan;
		let drawY = this.loc.Y;
		try {
			if(!this.exploding){
				ctx.beginPath();
				ctx.moveTo(drawX, drawY);
				ctx.lineTo(drawX - this.wingspan, drawY + 20);
				ctx.lineTo(drawX, drawY + 15);
				ctx.lineTo(drawX + this.wingspan, drawY + 20);
				ctx.lineTo(drawX, drawY);
				ctx.closePath();
				if(this.Invincible){
					let alpha = 255;
					if(this.invincibleTime % 2 == 0)
						alpha = 0;
					ctx.fillStyle = 'rgba(142,214,255,' + alpha + ')';
					this.invincibleTime += 1;
					if(this.invincibleTime >= 100){
						this.invincibleTime = 0;
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
				this.explodeDistance += 0.5;
				ctx.beginPath();
				ctx.moveTo(drawX, this.loc.Y);
				ctx.arc(drawX, this.loc.Y, this.explodeDistance, 2 * Math.PI, false);
				if(this.explodeDistance % 2 == 0)
					ctx.fillStyle = 'rgba(255, 255, 255, 1)';
				else
					ctx.fillStyle = 'rgba(255, 255, 0, 1)';
				ctx.fill();
				if (this.explodeDistance >= 40){
					this.explodeDistance = 0;
					this.exploding = false;
					this.loc.X = 250;
					this.loc.Y = 634;
				}
			}
		}
		catch (e){
		}
	}
	
	this.drawShields = function(ctx){
		let shieldRadius = 0;
		if( this.loc.Width > this.loc.Height )
			shieldRadius = this.loc.Width;
		else
			shieldRadius = this.loc.Height;
		
		ctx.strokeStyle = WeightChart(this.shields);
		ctx.beginPath();
		ctx.arc(this.loc.X + this.wingspan, this.loc.Y + this.loc.Height/2, shieldRadius, 2 * Math.PI, false);
		ctx.closePath();
		ctx.stroke();
	}

	this.processPowerUp = function(powerupLetter){
		switch(powerupLetter){
			case 'M':
				this.WeaponWeight += 1;
				break;
			case 'D':
				this.DualCannon = true;
				break;
			case 'S':
				this.Shields += 1;
				break;
		}
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
		let offset = this.wingspan;
		
		if(this.dualCannon){
			this.laserEnergy -= 20;
			target = new position(this.loc.X + 2, -10, 0, 0);
			projectiles.push(new missile(this.loc.X + 2, this.loc.Y, target, shotSpeed, this.weaponWeight));
			target = new position(this.loc.X + 12, -10, 0, 0);
			projectiles.push(new missile(this.loc.X + 12, this.loc.Y, target, shotSpeed, this.weaponWeight));
		}
		else{
			this.laserEnergy -= 10;
			projectiles.push(new missile(this.loc.X + offset, this.loc.Y, target, shotSpeed, this.weaponWeight));
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