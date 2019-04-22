enchant();

window.onload = function() {
	
	var game = new Game(240, 320); // 240×320画面（Canvas）を作成
	game.fps = 30;  // フレームレートの設定。30fpsに設定
	game.preload("images/pad.png", "images/ball.png", "images/block.png"); //画像データをあらかじめ読み込ませる
	game.rootScene.backgroundColor = "blue"; //ゲームの背景色を青色に設定
	game.score = 0; // スコアを入れる変数を用意する
	
	// スコアを表示するラベルを作成
	var scoreLabel = new Label("SCORE : 0");
	scoreLabel.font = "16px Tahoma";
	scoreLabel.color = "white";
	scoreLabel.x = 10; // X座標
	scoreLabel.y = 5; // Y座標
	game.rootScene.addChild(scoreLabel);
	
	// // 傾きを表示するラベルを作成
	// var sensorLabel = new Label("0");
	// sensorLabel.font = "10px Tahoma";
	// sensorLabel.color = "white";
	// sensorLabel.x = 200; // X座標
	// sensorLabel.y = 5; // Y座標
	// game.rootScene.addChild(sensorLabel);
	
	// ブロックの総数を入れるカウンタ変数
	var count = 0;
	// ブロックを格納する配列
	var block = new Array();
	// 消したブロックの総数を入れる変数
	var total = 0;
	
	// データの読み込みが完了したら処理
	game.onload = function() {
		
		// ボールの設定
		var ball = new Sprite(16, 16);
		ball.image = game.assets["images/ball.png"];
		ball.x = 0; // X座標
		ball.y = 0; // Y座標
		ball.dx = 3; //　X方向の移動量
		ball.dy = 5; //　Y方向の移動量
		game.rootScene.addChild(ball);
		
		// パトルの設定
		var pad = new Sprite(32, 16);
		pad.image = game.assets["images/pad.png"];
		pad.x = game.width / 2; // X座標
		pad.y = game.height - 40; // Y座標
		game.rootScene.addChild(pad);
		
		// ブロックを描く
		drawBlock();
		
		// フレームイベントが発生したら処理
		game.rootScene.addEventListener( Event.ENTER_FRAME, function(){
			
			moveBall(); // ボールを移動させる
			movePaddle(); // パドルを移動させる（キーボード対応）
			hitCheck_paddle_ball(); // パドルとボールの接触判定
			hitCheck_block_ball(); // ボールとブロックの接触判定
			
			// ==============各種処理====================
			// --------■ ボールを移動させる-------------------
			function moveBall() {
				ball.x = ball.x + ball.dx; // X方向の移動量を加算
				ball.y = ball.y + ball.dy; // Y方向の移動量を加算
				
				// 画面外かどうか調べる
				if ( (ball.x < 0) || ( ball.x > (game.width - ball.width)) ) {
					ball.dx = -ball.dx;
				}
				if ( ball.y < 0 ) {
					ball.dy = -ball.dy;
				}
				
				// ボールが下まで行ったらゲームオーバー
				if ( ball.y > game.height ) {
					game.stop();
					alert("スコアは" + game.score + "点でした");
				}
			}
			
			// --------------- ■ パドルを移動させる-----------------			
			function movePaddle() {
				// パドルを移動させる
				if ( game.input.left ) {
					pad.x = pad.x - 4; // パドルを左に移動
					if ( pad.x < 0 ) { // 左端かどうか調べる
						pad.x = 0;
					}
				}
				if ( game.input.right ) {
					pad.x = pad.x + 4; // パドルを右に移動
					if ( pad.x > (game.width - pad.width) ) { // 右端かどうか調べる
						pad.x = game.width - pad.width;
					}
				}

				if ( pad.x < 0 ) { // 左端かどうか調べる
					pad.x = 0;
				}
				if ( pad.x > (game.width - pad.width) ) { // 右端かどうか調べる
					pad.x = game.width - pad.width;
				}
			}
			
			// -------------■ パドルとボールの接触判定を行う
			function hitCheck_paddle_ball() {
				if ( pad.intersect(ball) ) {
					ball.dy = -ball.dy; // 接触した場合はボールのY方向の移動量を逆にする
					ball.y = pad.y - ball.height - 1; // うまく跳ね返るように調整
					game.score = game.score + 10; // スコアを加算（10点）
					scoreLabel.text = "SCORE : " + game.score;
				}
			}
			
			// ------------ ■ ブロックとボールの接触判定を行う
			function hitCheck_block_ball() {
				for ( var i = 0; i < count; i++ ) {
					if ( ball.intersect(block[i]) ) {
						ball.dy = -ball.dy; // 接触した場合はボールのY方向の移動量を逆にする
						block[i].y = -9999; // 見えない場所に移動
						game.score = game.score + 5; // スコアを加算（5点）
						total = total - 1; // 総ブロック数から1を引く
						if ( total < 1 ) { // 全部消したか調べる
							drawBlock(); // ブロックを再描画
						}
					}
				}
				scoreLabel.text = "SCORE : " + game.score;
			}
			
			});
		};
		
	game.start(); // ゲーム処理開始
	function drawBlock() {
		count = 0; // ブロックの総数を示すカウンタを0にする
		// ボールの設定を縦横の数だけ繰り返し生成
		for ( var x = 0; x < 5; x++ ) {
			for ( var y = 0; y < 7; y++ ) {
				block[count] = new Sprite(24, 12);
				block[count].image = game.assets["images/block.png"];
				block[count].x = x * 32 + 12; // X座標
				block[count].y = y * 18 + 30; // Y座標
				game.rootScene.addChild(block[count]);
				count = count + 1; // ブロックの総数を示すカウンタを増やす
			}
		}
		total = count; // 消すブロックの総数を変数に入れる
	}
};







