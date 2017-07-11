window.onload = function() {
	//按钮事件
	var rs = document.getElementById("restart");
	rs.onclick = function(){
		window.location.reload();
	}
	//抓取元素
	var words = document.querySelector(".words");	
	var chess = document.getElementById("chess");
	var context = chess.getContext("2d");
	var width = context.canvas.width;
	var height = context.canvas.height;
	//绘制棋盘背景
	var logo = new Image();
	logo.src = "img/五子棋棋盘__.jpg";
	logo.onload = function(){
		context.drawImage(logo, 0, 0,width,height);
		drawChessMap();
		
	}

	//落子事件
	var oneStep = function(i,j,m) {
		context.beginPath();
		context.arc(15 + i*30, 15 + j*30, 13, 0, 2*Math.PI);
		context.closePath();
		var gradient = context.createRadialGradient(15 + i*30 + 4, 15 + j*30 - 2, 13, 15 + i*30 + 2, 15 + j*30 - 2, 0);
		if(m) {
			gradient.addColorStop(0,"#0a0a0a");
			gradient.addColorStop(1,"#636766");
		} else {
			gradient.addColorStop(0,"#d1d1d1");
			gradient.addColorStop(1,"#f9f9f9");
		}		
		context.fillStyle = gradient;
		context.fill();		
	}

	var chessBoard = [];
	var me = true;
	var over = false;
	
	for (var i=0; i<15; i++){
		chessBoard[i] = [];
		for (var j=0; j<15; j++) {
			chessBoard[i][j] = 0;
		}
	}
	//储存棋盘上所有的落点位 ，0表示没有落子 是空 
	
	//赢法数组
	var wins = [];
	for (var i=0; i<15;i++) {
		wins[i] = [];
		for (var j=0; j<15; j++) {
			wins[i][j] = [];
		}
	}
			
	var count = 0;//有多少种赢法
	
	for (var i=0; i<15; i++){
		for (var j=0; j<11; j++) {
			for (var k=0; k<5; k++) {
				wins[i][j+k][count] = true;
			}
			count++;
		}
	}
	//竖线赢法
			
	for (var i=0; i<11; i++){
		for (var j=0; j<15; j++) {
			for (var k=0; k<5; k++) {
				wins[i+k][j][count] = true;
			}
			count++;
		}
	}
	//横线赢法
			
	for (var i=0; i<11; i++){
		for (var j=0; j<11; j++) {
			for (var k=0; k<5; k++) {
				wins[i+k][j+k][count] = true;
			}
			count++;
		}
	}
	//斜线赢法
			
	for (var i=0; i<11; i++){
		for (var j=14; j>3; j--) {
			for (var k=0; k<5; k++) {
				wins[i+k][j-k][count] = true;
			}
			count++;
		}
	}
	//反斜线赢法
	console.log(count);//总共有多少种赢法
			
			
	//赢法的统计数组
	var myWin = [];
	var computerWin = [];
	for (var i=0; i<count; i++) {
		myWin[i] = 0;
		computerWin[i] = 0;
	}//初始化
				
	//电脑AI
	var computerAI = function(){
		var myScore = [];
		var computerScore = [];
		var max = 0;//保存最高分数
		var u = 0;
		var v = 0;
				
		for (var i=0; i<15; i++) {
			myScore[i] = [];
			computerScore[i] = [];
			for (var j=0; j<15; j++) {
				myScore[i][j] = 0;
				computerScore[i][j] = 0;
			}
		}
		//初始化 myScore computerScore
				
		for(var i=0; i<15; i++){
			for(var j=0; j<15; j++){
				if(chessBoard[i][j] == 0) {
					for (var k=0; k<count; k++) {
						if(wins[i][j][k]) {
							if(myWin[k] == 1){
								myScore[i][j] += 200;
							} else if (myWin[k] == 2){
								myScore[i][j] += 400;
							} else if (myWin[k] == 3){
								myScore[i][j] += 2000;
							} else if (myWin[k] == 4){
								myScore[i][j] += 10000;
							}
							if(computerWin[k] == 1){
								computerScore[i][j] += 220;
							} else if (computerWin[k] == 2){
								computerScore[i][j] += 420;
							} else if (computerWin[k] == 3){
								computerScore[i][j] += 2100;
							} else if (computerWin[k] == 4){
								computerScore[i][j] += 20000;
							}
						}//比较2者分数的高低
					}
					
					if (myScore[i][j] > max) {
						max = myScore[i][j];
						u = i;
						v = j;
					} else if (myScore[i][j] == max){
						if (computerScore[i][j] > computerScore[u][v]) {
							u = i;
							v = j;
						}
					}
							
					if (computerScore[i][j] > max) {
						max = computerScore[i][j];
						u = i;
						v = j;
					} else if (computerScore[i][j] == max){
						if (myScore[i][j] > myScore[u][v]) {
							u = i;
							v = j;
						}
					}						
				}	
			}
		}
	oneStep(u,v,false);
	chessBoard[u][v] = 2;
	for (var k=0; k<count; k++) {
		if (wins[u][v][k]) {
			computerWin[k]++;
				myWin[k] = 6;
				if ( computerWin[k] ==5){
					words.innerHTML = "你输了";
					over = true;
				}
			}
		}
		if (!over) {
			me = !me;
		}					
	}
	

	
	var drawChessMap = function(){
		context.strokeStyle = "#bfbfbf";
		for (i=0;i<15;i++) {
			//绘制横线
			context.moveTo(15,15+i*30);
			context.lineTo(435,15+i*30);
			context.stroke();
			
			//绘制竖线
			context.moveTo(15+i*30,15);
			context.lineTo(15+i*30,435);
			context.stroke();
		}	

	}
	
	chess.onclick = function (e) {
		if (over) {
			return;
		}
		if (!me) {
			return;
		}
		var x = e.offsetX;
		var y = e.offsetY;
		var i = Math.floor(x / 30);
		var j = Math.floor(y / 30);
		if (chessBoard[i][j] == 0 ){
			oneStep(i,j,me);
			chessBoard[i][j] = 1;
			for (var k=0; k<count; k++) {
				if (wins[i][j][k]) {
					myWin[k]++;
					computerWin[k] = 6;
					if ( myWin[k] ==5){
						words.innerHTML = "你赢了";
						over = true;
					}
				}
			}
			if (!over) {
				me = !me;
				computerAI();
			}
		}
	}	

}
