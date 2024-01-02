function position(x, y, width, height){
	this.X = x;
	this.Y = y;
	this.width = width;
	this.height = height;
	this.getX1 = function(){
		return this.X + this.width;
	}
	this.getY1 = function(){
		return this.Y + this.height;
	}

	this.centerX = function(){
		return this.X + this.width / 2;
	}

	this.centerY = function(){
		return this.Y + this.height / 2;
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