var width = 500,
 height = 720,
 user = ['A','A','A'],
 SelectedInitial = 0;
 
// Get the context from off the page!
 c = document.getElementById('c'),
 ctx = c.getContext('2d');

c.top = 150;
c.width = width;
c.height = height;

var clear = function(){
  ctx.fillStyle = '#000000';  
  ctx.beginPath();
  ctx.rect(0,0, width, height);
  ctx.closePath();
  ctx.fill();
  };

var GameLoop = function(){  
	clear();
	
	ctx.fillStyle = "Green";
	ctx.font = "40px Arial";
	ctx.textAlign = 'center';
	ctx.fillText("GAME OVER!", 500/2, 200);
	ctx.fillText("NEW HIGH SCORE!", 500/2, 300);
	ctx.fillText(user[0] + " " + user[1] + " " + user[2],500/2, 400);
	ctx.fillText("_",212 + SelectedInitial * 38,400);
	
	gloop = setTimeout(GameLoop, 1000 / 50);
}

var ChangeInitial = function(Idx, Up){
	code = user[Idx].charCodeAt(0);
	if(Up){
		code += 1;
		if( code > 90 )
			code = 65;
	}
	else{
		code -= 1;
		if( code < 65 )
			code = 90;
	}
	user[Idx] = String.fromCharCode(code);
}

var ChangeSelected = function(Left){
	if(Left){
		SelectedInitial -= 1;
		if( SelectedInitial < 0 )
			SelectedInitial = 0;
	}
	else{
		SelectedInitial += 1;
		if( SelectedInitial > 2 )
			SelectedInitial = 2;
	}
}

KeyboardController({37: function() {ChangeSelected(true);},
					38: function() {ChangeInitial(SelectedInitial,true);},
					39: function() {ChangeSelected(false);},
					40: function() {ChangeInitial(SelectedInitial,false);}},200);
  
GameLoop();