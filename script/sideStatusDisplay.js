function sideStatusDisplay(x, y, width, height){
	this.loc = new position(x, y, width, height);

	this.draw = function(ctx, player, showStatus){
		ctx.fillStyle = '#EEEEEE';
		ctx.fillRect(this.loc.X, this.loc.Y, this.loc.width, this.loc.height);
		
		if (!showStatus)
			return;

		ctx.font = '15px Arial';
		ctx.fillStyle = '#000000';
		ctx.textAlign = 'left';
		ctx.fillText( 'Type:' + player.getMissileType(), 505, 100 );
		ctx.fillText( 'Gun:', 505, 120 );
		ctx.fillText( 'Shield:', 505, 140 );

		if( player.Shields == 0 )
			ctx.fillText( 'NONE', 550, 140 );
		else
		{
			ctx.fillStyle = WeightChart(player.shields);
			ctx.fillRect( 550, 130, 40, 10 );
		}
		
		ctx.fillStyle = WeightChart(player.weaponWeight);
		ctx.fillRect( 550, 110, 40, 10 );

		let bottomY = 690
		let spacer = 25;

		ctx.fillStyle = '#000000';
		ctx.textAlign = 'center';
		ctx.fillText( '~Power Ups~', 550, bottomY - spacer * 4)
		this.drawPowerUp(ctx, 'M', new position(505, bottomY - spacer * 3, 20, 20));
		this.drawPowerUp(ctx, 'D', new position(505, bottomY - spacer * 2, 20, 20));
		this.drawPowerUp(ctx, 'S', new position(505, bottomY - spacer, 20, 20));

		this.drawPlayerEnergy(ctx, player);
	}

	this.drawPowerUp = function(ctx, letter, location){
		let color = '#000000';
		let description = '';
		switch(letter){
		case 'M':
			color = '#AA3333';
			description = 'Missile Up';
			break;
		case 'D':
			color = '#004400';
			description = 'Dual Shot';
			break;
		case 'S':
			color = '#116611';
			description = 'Shield Up';
			break;
		}

		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(location.centerX(), location.centerY(), location.width / 2, 2 * Math.PI, false);
		ctx.fill();

		ctx.font = '14px Arial';
		ctx.textAlign = 'center';
		let textData = ctx.measureText(letter);
		let textY = location.centerY() + textData.actualBoundingBoxAscent / 2;
		ctx.fillStyle = 'rgba(255, 255, 255, 255)';
		ctx.fillText(letter, location.centerX(), textY);

		ctx.fillStyle = '#000000';
		ctx.textAlign = 'left';
		ctx.fillText(description, location.centerX() + 15, textY);
	}

	this.drawPlayerEnergy = function(ctx, player){
		let energy = player.laserEnergy;
		let energyMax = player.laserEnergyMax;
		let energyWidth = 100;
		let energyHeight = 10;
		let energyX = 480 - energyWidth;
		let energyY = 740 - energyHeight;

		ctx.fillStyle = '#888888';
		ctx.fillRect(0, 720, 500, 30);

		if (energy < energyMax / 3)
			ctx.fillStyle = '#FF0000';
		else if (energy < energyMax * 2 / 3)
			ctx.fillStyle = '#FFFF00';
		else
			ctx.fillStyle = '#00FF00';

		ctx.fillRect(energyX, energyY, energyWidth * (energy / energyMax), energyHeight);
		ctx.strokeStyle = '#FFFFFF';
		ctx.strokeRect(energyX, energyY, energyWidth, energyHeight);

		ctx.font = 'italic bold 15px Arial';
		ctx.fillStyle = '#000000';
		ctx.textAlign = 'left';
		ctx.fillText( 'WEAPON ENERGY:', 230, 740 );
	}
}