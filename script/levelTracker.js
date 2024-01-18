var MakerState = {
	PRODUCE   :  0,
	WAIT      :  1,
	NEXT_LEVEL:  2};

function levelTracker(maxLevel){
	this.levelNumber = 1;
	this.maxLevel = maxLevel;
	this.levelFactory = new levelFactory();
	this.level = this.levelFactory.create(this.levelNumber);
	this.state = MakerState.PRODUCE;
	this.startProducingAt = 0;
	
	this.update = function(frameNumber, enemies){
		switch(this.state)
		{
			case MakerState.PRODUCE:
				this.processProduce(frameNumber, enemies);
				break;
			case MakerState.WAIT:
				this.processWait(frameNumber, enemies);
				break;
			case MakerState.NEXT_LEVEL:
				if (frameNumber >= this.startProducingAt){
					this.state = MakerState.PRODUCE;
					this.level.setNextAlien(frameNumber);
				}
				break;
		}
	}

	this.processProduce = function(frameNumber, enemies){
		if (frameNumber < this.level.nextAlien())
			return;

		enemies.push(this.level.getEnemy());
		this.level.setNextAlien(frameNumber);
		this.level.incrementAliensProduced();

		if( this.level.producedAllAliens() )
		{
			this.state = MakerState.WAIT;
		}
	}

	this.processWait = function(frameNumber, enemies){
		let alive = enemies.some(function(enemy){
			return enemy.isDead() == false;
		});

		if(alive)
			return;

		if(!this.level.levelComplete()){
			this.level.incrementPhase();
			this.level.setNextAlien(frameNumber);
			this.state = MakerState.PRODUCE;
			return;
		}

		this.state = MakerState.NEXT_LEVEL;
		this.startProducingAt = frameNumber + 150;
		this.levelNumber += 1;
		this.level = this.levelFactory.create(this.levelNumber);
	}

	this.showLevelUp = function(){
		return this.state == MakerState.NEXT_LEVEL;
	}

	this.victoryConditionsMet = function(){
		return this.levelNumber > this.maxLevel;
	}
}