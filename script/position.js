function position(x, y, W, H){
	this.X = x;
	this.Y = y;
	this.Width = W;
	this.Height = H;
	this.getX1 = function(){
		return this.X + this.Width;
	}
	this.getY1 = function(){
		return this.Y + this.Height;
	}

	this.centerX = function(){
		return this.X + this.Width / 2;
	}

	this.centerY = function(){
		return this.Y + this.Height / 2;
	}
	
	this.CollidedWith = function(L1){
		if(( L1.getY1() < this.Y ) || ( L1.Y > this.getY1() ||
		   ( L1.X > this.getX1() ) || ( L1.getX1() < this.X )))
		{
			return false;
		}
		else
		{
			return true;
		}
	}
}