function powerup(x, y){
	this.size = 24;
	this.loc = new position(x, y, this.size, this.size);
	randomNumber = Math.floor(Math.random() * 8);
	switch(randomNumber){
	case 0:
		this.Letter = 'M';
		break;
	case 1:
		this.Letter = 'M';
		break;
	case 2:
		this.Letter = 'M';
		break;
	case 3:
		this.Letter = 'S';
		break;
	case 4:
		this.Letter = 'S';
		break;
	case 5:
		this.Letter = 'S';
		break;
	case 6:
		this.Letter = 's';
		break;
	case 7:
		this.Letter = 'D';
	}

	this.draw = function(ctx){
		if(debugCollisions){
			ctx.strokeStyle = 'White';
			ctx.strokeRect(this.loc.X, this.loc.Y, this.loc.Width, this.loc.Height);
			return;
		}
		
		switch(this.Letter){
		case 'M':
			this.Color = '#AA3333';
			break;
		case 'D':
			this.Color = '#004400';
			break;
		case 'S':
			this.Color = '#116611';
			break;
		}
		OldStyle = ctx.fillStyle;
		ctx.fillStyle = this.Color;
		ctx.beginPath();
		ctx.arc(this.loc.centerX(), this.loc.centerY(), this.size / 2, 2 * Math.PI, false);
		ctx.fill();
		ctx.fillStyle = OldStyle;

		ctx.font = '14px Arial';
		ctx.textAlign = 'center';
		let textData = ctx.measureText(this.Letter);
		ctx.fillStyle = 'rgba(255, 255, 255, 255)';
		ctx.fillText(this.Letter, this.loc.centerX(), this.loc.centerY() + (textData.actualBoundingBoxAscent / 2));
	}

	this.move = function(){
		this.loc.Y += 4;
	}
}