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
			if(y > 720 - this.loc.height)
				y = 720 - this.loc.height;
				
			this.loc.x = x;
			this.loc.y = y;
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
			ctx.strokeRect(this.loc.x, this.loc.y, this.loc.width, this.loc.height);
			return;
		}

		let drawX = this.loc.x + this.wingspan;
		let drawY = this.loc.y;
		try {
			if(!this.exploding){
				ctx.beginPath();
				ctx.moveTo(drawX, drawY);
				ctx.lineTo(drawX - this.wingspan, drawY + 20);
				ctx.lineTo(drawX, drawY + 15);
				ctx.lineTo(drawX + this.wingspan, drawY + 20);
				ctx.lineTo(drawX, drawY);
				ctx.closePath();
				if(this.invincible){
					let alpha = 255;
					if(this.invincibleTime % 2 == 0)
						alpha = 0;
					ctx.fillStyle = 'rgba(142,214,255,' + alpha + ')';
					this.invincibleTime += 1;
					if(this.invincibleTime >= 100){
						this.invincibleTime = 0;
						this.invincible = false;
					}
				}
				else
					ctx.fillStyle = 'rgba(142,214,255,255)';
				ctx.fill();
				if( this.shields > 0 )
					this.drawShields(ctx);
			}
			else{
				this.explodeDistance += 0.5;
				ctx.beginPath();
				ctx.moveTo(drawX, this.loc.y);
				ctx.arc(drawX, this.loc.y, this.explodeDistance, 2 * Math.PI, false);
				if(this.explodeDistance % 2 == 0)
					ctx.fillStyle = 'rgba(255, 255, 255, 1)';
				else
					ctx.fillStyle = 'rgba(255, 255, 0, 1)';
				ctx.fill();
				if (this.explodeDistance >= 40){
					this.explodeDistance = 0;
					this.exploding = false;
					this.loc.x = 250;
					this.loc.y = 634;
				}
			}
		}
		catch (e){
		}
	}
	
	this.drawShields = function(ctx){
		let shieldRadius = 0;
		if( this.loc.width > this.loc.height )
			shieldRadius = this.loc.width;
		else
			shieldRadius = this.loc.height;
		
		ctx.strokeStyle = WeightChart(this.shields);
		ctx.beginPath();
		ctx.arc(this.loc.x + this.wingspan, this.loc.y + this.loc.height/2, shieldRadius, 2 * Math.PI, false);
		ctx.closePath();
		ctx.stroke();
	}

	this.processPowerUp = function(powerupLetter){
		switch(powerupLetter){
			case 'M':
				this.weaponWeight += 1;
				break;
			case 'D':
				this.dualCannon = true;
				break;
			case 'S':
				this.shields += 1;
				break;
		}
	}

	this.moveLeft = function(){
		this.setPosition(this.loc.x - this.speed, this.loc.y);
	}

	this.moveRight = function(){
		this.setPosition(this.loc.x + this.speed, this.loc.y);
	}

	this.moveUp = function(){
		this.setPosition(this.loc.x, this.loc.y - this.speed);
	}

	this.moveDown = function(){
		this.setPosition(this.loc.x, this.loc.y + this.speed);
	}

	this.resetShootDelay = function(){
		this.readyToShoot = true;
		this.rechargeDelay = 0;
	}

	this.getProjectiles = function(){
		let projectiles = [];
		let shotSpeed = 10;
		let target = new position(this.loc.x, -10, 0, 0);
		let offset = this.wingspan;
		
		if(this.dualCannon){
			this.laserEnergy -= 20;
			target = new position(this.loc.x + 2, -10, 0, 0);
			projectiles.push(new missile(this.loc.x + 2, this.loc.y, target, shotSpeed, this.weaponWeight));
			target = new position(this.loc.x + 12, -10, 0, 0);
			projectiles.push(new missile(this.loc.x + 12, this.loc.y, target, shotSpeed, this.weaponWeight));
		}
		else{
			this.laserEnergy -= 10;
			projectiles.push(new missile(this.loc.x + offset, this.loc.y, target, shotSpeed, this.weaponWeight));
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
	this.direction = Math.atan2(target.y - this.loc.y, target.x - this.loc.x);

	this.Color = WeightChart(this.weight);

	this.draw = function(ctx){
		if (debugCollisions){
			ctx.strokeStyle = 'White';
			ctx.strokeRect(this.loc.x, this.loc.y, this.loc.width, this.loc.height);
			return;
		}

		ctx.save();
		ctx.translate(this.loc.x, this.loc.y);
		ctx.rotate(this.direction + Math.PI / 2);

		ctx.fillStyle = this.Color;
		ctx.fillRect(this.loc.width / -2, this.loc.height / -2, this.loc.width, this.loc.height);

		ctx.restore();
	}

	this.move = function(){
		this.loc.x += Math.cos(this.direction) * this.speed;
		this.loc.y += Math.sin(this.direction) * this.speed;
	}

	this.endDuration = function(){
		if(this.loc.y < -5 || this.loc.y > 720 || this.loc.x < -5 || this.loc.x > 500)
			return true;

		return false;
	}
}