function powerup(x, y){
	this.size = 24;
	this.loc = new position(x, y, this.size, this.size);
	let randomNumber = Math.floor(Math.random() * 8);
	switch(randomNumber){
	case 0:
		this.letter = 'M';
		break;
	case 1:
		this.letter = 'M';
		break;
	case 2:
		this.letter = 'M';
		break;
	case 3:
		this.letter = 'S';
		break;
	case 4:
		this.letter = 'S';
		break;
	case 5:
		this.letter = 'S';
		break;
	case 6:
		this.letter = 'S';
		break;
	case 7:
		this.letter = 'D';
		break;
	}

	this.draw = function(ctx){
		if(debugCollisions){
			ctx.strokeStyle = 'White';
			ctx.strokeRect(this.loc.x, this.loc.y, this.loc.width, this.loc.height);
			return;
		}
		
		let color = '#FFFFFF'
		switch(this.letter){
		case 'M':
			color = '#AA3333';
			break;
		case 'D':
			color = '#004400';
			break;
		case 'S':
			color = '#116611';
			break;
		}
		let oldStyle = ctx.fillStyle;
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(this.loc.centerX(), this.loc.centerY(), this.size / 2, 2 * Math.PI, false);
		ctx.fill();
		ctx.fillStyle = oldStyle;

		ctx.font = '14px Arial';
		ctx.textAlign = 'center';
		let textData = ctx.measureText(this.Letter);
		ctx.fillStyle = 'rgba(255, 255, 255, 255)';
		ctx.fillText(this.letter, this.loc.centerX(), this.loc.centerY() + (textData.actualBoundingBoxAscent / 2));
	}

	this.move = function(){
		this.loc.y += 4;
	}
}