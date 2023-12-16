function player(){
// Drawing
    this.Wingspan = 8;
    
// Weaponry
	this.WaveCannon = false;
	this.DualCannon = false;
	this.WeaponWeight = 1;

// Shields
    this.Shields = 0;

// Player Damaged / Killed
	this.InvincibleTime = 0;
	this.Invincible = false;
	this.Exploding = false;
	this.ExplodeDistance = 0;
	this.loc = new position(212.5, 634, 16, 20);
	
	this.died = function(){
		this.WaveCannon = false;
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
            if(y > 720 - this.Height)
                y = 720 - this.Height;
                
			this.loc.X = x;
			this.loc.Y = y;
		}
	}
    
    this.getMissileType = function(){
        if(this.WaveCannon)
            return 'WAVE';
        
        if(this.DualCannon)
            return 'DUAL';
        
        return 'SINGLE';
    }
	
	this.draw = function(){
        var drawX = this.loc.X + this.Wingspan;
        var drawY = this.loc.Y;
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
                    ctx.font = '10px Arial';
					ctx.fillStyle = 'rgba(142,214,255,' + this.InvincibleTime * 0.013 + ')';
                    ctx.fillText(75 - this.InvincibleTime, this.loc.getX1() - 5, this.loc.Y + 10);
					this.InvincibleTime += 1;
					if(this.InvincibleTime >= 75){
						this.InvincibleTime = 0;
						this.Invincible = false;
					}
				}						
				else
					ctx.fillStyle = 'rgba(142,214,255,255)';
				ctx.fill();
                if( this.Shields > 0 )
                    this.drawShields();
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
    
    this.drawShields = function(){
        var ShieldRadius = 0;
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
}
  
function missile(x, y, weight, direction, isWave){
	if(isWave)
		this.loc = new position(x, y, 40, 10);
	else
		this.loc = new position(x, y, 3, 9);
  this.Weight = weight;
  this.Direction = direction;
  this.Wave = isWave;
  
  switch(this.Direction){
  case 0:
	this.Duration = y - 400;
	break;
  case 1:
	this.Duration = y + 400;
	break;
  }
  
  this.Color = WeightChart(this.Weight);
  
  this.draw = function(){
	if(this.Wave){
		ctx.beginPath();
		ctx.arc(this.loc.X,this.loc.Y,20, 0, Math.PI, true);
		ctx.closePath();
		ctx.fillStyle = this.Color;
		ctx.fill();
	}
	else{
		ctx.fillStyle = this.Color;
		ctx.fillRect(this.loc.X, this.loc.Y,this.loc.Width, this.loc.Height);
	}
  }
  
  this.move = function(){
	switch(this.Direction){
	case 0:
		this.loc.Y -= 10;
		break;
	case 1:
		this.loc.Y += 10;
		break;
	}
  }
  
  this.EndDuration = function(){
	switch(this.Direction){
	case 0:
		if(this.loc.Y < this.Duration)
			return true;
		break;
	case 1:
		if(this.loc.Y > this.Duration)
			return true;
		break;
	}
	return false;
  }
  
}