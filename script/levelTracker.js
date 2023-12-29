var MakerState = {
	PRODUCE   :  0,
	WAIT      :  1,
	NEXT_LEVEL:  2};

function levelTracker(){
	this.getLevel = function(){
		let phases = [];
		phases.push(new phase());
		phases.push(new phase());
		return new level(phases, this.levelNumber);
	}

	this.levelNumber = 1;
	this.level = this.getLevel();
	this.state = MakerState.PRODUCE;
	this.startProducingAt = 0;
	
	this.Process = function(frameNumber, enemies){
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
		this.level = this.getLevel();
	}

	this.showLevelUp = function(){
		return this.state == MakerState.NEXT_LEVEL;
	}
}

function level(phases, levelNumber){
	this.phases = phases;
	this.currentPhase = 0;
	this.number = levelNumber

	this.nextAlien = function(){
		return this.phases[this.currentPhase].nextAlien;
	}

	this.setNextAlien = function(frameNumber){
		this.phases[this.currentPhase].setNextAlien(frameNumber);
	}

	this.incrementAliensProduced = function(){
		this.phases[this.currentPhase].aliensProduced += 1;
	}

	this.producedAllAliens = function(){
		return this.phases[this.currentPhase].producedAllAliens();
	}

	this.incrementPhase = function(){
		if (this.currentPhase < this.phases.length -1)
			this.currentPhase += 1;
	}

	this.levelComplete = function(){
		return this.currentPhase == this.phases.length - 1 && this.phases[this.currentPhase].phaseComplete();
	}

	this.getEnemy = function(){
		if (this.currentPhase % 2 == 0)
			return new swooper((Math.random() * 300 + 100), Math.random() * 50, this.number, this.number);
		else
			return new demon((Math.random() * 350 + 50), Math.random() * 50, this.number, this.number);
	}
}

function phase(){
	this.aliensInPhase = 10;
	this.interval = 100;
	this.nextAlien = 0;
	this.aliensProduced = 0;

	this.setNextAlien = function(frameNumber){
		this.nextAlien = frameNumber + this.interval;
	}

	this.producedAllAliens = function(){
		return this.aliensProduced == this.aliensInPhase;
	}

	this.phaseComplete = function(){
		return this.aliensProduced == this.aliensInPhase;
	}
}