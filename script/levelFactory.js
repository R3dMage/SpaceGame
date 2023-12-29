

function levelFactory(){

	this.create = function(levelNumber){
		let phases = [];
		phases.push(new phase());
		phases.push(new phase());
		return new level(phases, levelNumber);
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