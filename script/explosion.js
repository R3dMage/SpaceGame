function kaboom(x, y, size){
	this.loc = new position(x, y, size, size);
	this.explodeDistance = 0;
	this.Done = false;
	
	this.draw = function(ctx){
		if(!this.Done){
			this.explodeDistance += 0.5;
			ctx.beginPath();
			ctx.moveTo(this.loc.x, this.loc.y);
			ctx.arc(this.loc.x, this.loc.y, this.explodeDistance, 2 * Math.PI, false);
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