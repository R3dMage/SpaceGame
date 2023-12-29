var MakerState = {
	PRODUCE   :  0,
	WAIT      :  1,
    NEXT_LEVEL:  2};

function levelTracker(){
    this.level = 1;
    this.phase = 1;
    this.state = MakerState.PRODUCE;
    this.aliensProduced = 0;
	this.aliensInLevel = 10;
	this.interval = 100;
    this.nextAlienAt = 0;
    this.startProducingAt = 0;
    
    this.Process = function(frameNumber, enemies){
        switch(this.state)
        {
            case MakerState.PRODUCE:
                if( frameNumber >= this.nextAlienAt )
                {
                    enemies.push(this.getEnemy());
                    this.nextAlienAt = frameNumber + this.interval;
                    this.aliensProduced += 1;
                    if( this.aliensProduced == this.aliensInLevel )
                    {
                        this.state = MakerState.WAIT;
                        this.aliensProduced = 0;
                    }
                }
                break;
            case MakerState.WAIT:
                let alive = enemies.some(function(enemy){
                    return enemy.isDead() == false;
                });

                if (!alive){
                    this.state = MakerState.NEXT_LEVEL;
                    // this.aliensInLevel += 10;
                    this.startProducingAt = frameNumber + 150;
                    this.level += 1;
                }
                break;
            case MakerState.NEXT_LEVEL:
                if (frameNumber >= this.startProducingAt){
                    this.state = MakerState.PRODUCE;
                    this.nextAlienAt = frameNumber + this.interval;
                }
                break;
        }
    }

    this.showLevelUp = function(){
        return this.state == MakerState.NEXT_LEVEL;
    }
    
    this.getEnemy = function(){
        if ( this.level % 2 == 0 )
            return new demon((Math.random() * 500), Math.random() * 50, this.level, this.level);
        else
            return new swooper((Math.random() * 400 + 100), Math.random() * 50, this.level, this.level);
    }
}