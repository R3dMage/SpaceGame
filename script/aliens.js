var SwooperState = {
	SWOOP   :  0,
	RUSH    :  1,
	RETREAT :  2};
	
function swooper(x, y, health, weight){
  this.loc = new position(x, y, 40, 15);
  this.size = 18;
  this.Health = health;
  this.Weight = weight;
  this.State = SwooperState.SWOOP;
  this.moveRight = true;
  this.Color = '8844FF'
  X = (Math.random() * 10) + 80;
  this.PosX = this.loc.X + X;
  this.NegX = this.loc.X - X;
  this.OrigY = this.loc.Y;
  this.OrigX = this.loc.X;
  this.Swoop = 0;
  this.SwoopMax = Math.random() * 10;
  this.PowerUp = false;
  if (Math.random() * 100 < 10)
	this.PowerUp = true;

  this.draw = function(){
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
  
  this.fire = function(){
	X = Math.random() * 1000;
	if ( X > 1000 - this.Weight * 10)
		return true;
	else
		return false;
  }
  
  this.move = function(){	
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
			this.State = SwooperState.RETREAT;}
		break;
	case SwooperState.RETREAT:
		this.loc.Y -= 5;
		if (this.loc.Y <= this.OrigY)
			this.State = SwooperState.SWOOP;
		break;
	}
  }
}