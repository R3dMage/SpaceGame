function kaboom(x, y, Size){
	this.loc = new position(x, y, Size, Size);
	this.explodeDistance = 0;
	this.Done = false;
	
	this.draw = function(ctx){
		if(!this.Done){
			this.explodeDistance += 0.5;
			ctx.beginPath();
			ctx.moveTo(this.loc.X, this.loc.Y);
			ctx.arc(this.loc.X, this.loc.Y, this.explodeDistance, 2 * Math.PI, false);
			ctx.closePath();
			if(this.explodeDistance % 2 == 0)
				ctx.fillStyle = 'rgba(255, 255, 255,' + Math.random()/2 + ')';
			else
				ctx.fillStyle = 'rgba(255, 255, 0,' + Math.random()/2 + ')';
			ctx.fill();
			if (this.explodeDistance >= this.loc.width)
				this.Done = true;
		}
	}	
}