var MakerState = {
	PRODUCE   :  0,
	WAIT      :  1,};

function EnemyMaker(){
    this.level = 1;
    this.State = MakerState.PRODUCE;
    this.AliensProduced = 0;
    this.Time = new Date();
	this.AliensInLevel = 10;
	this.Interval = 6;
    
    this.Process = function(){
        var T = new Date();
        switch(this.State)
        {
            case MakerState.PRODUCE:
                if( (T - this.Time)/1000 >= this.Interval )
                {
                    this.Time = new Date();
                    Enemies.push(this.getEnemy());
                    this.AliensProduced += 1;
                    if( this.AliensProduced == this.AliensInLevel )
                    {
                        this.State = MakerState.WAIT;
                        this.AliensProduced = 0;
                    }
                }
                break;
            case MakerState.WAIT:
                break;
        }
    }
    
    this.getEnemy = function(){
        //if ( this.level == 1 )
            return new swooper((Math.random() * 500), Math.random() * 50, this.level, this.level);
        
    }
}