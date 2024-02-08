

function levelFactory(){

	this.create = function(levelNumber, playerPositionProvider){
		let phases = [];
		phases.push(new phase(10, 100));
		phases.push(new phase(10, 50));
		phases.push(new phase(3, 50));
		return new level(phases, levelNumber, playerPositionProvider);
	}
}

function level(phases, levelNumber, playerPositionProvider){
	this.phases = phases;
	this.currentPhase = 0;
	this.number = levelNumber
	this.playerPositionProvider = playerPositionProvider;

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
		switch(this.currentPhase){
			case 0:
				return new swooper((Math.random() * 350 + 50), Math.random() * 50, this.number, this.number);
			case 1:
				return new demon((Math.random() * 350 + 50), Math.random() * 50, this.number, this.number);
			case 2:
				return new predator((Math.random() * 350 + 50), Math.random() * 50, this.number, this.number, this.playerPositionProvider);
		}
	}
}

function phase(numberOfAliens, interval){
	this.aliensInPhase = numberOfAliens;
	this.interval = interval;
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