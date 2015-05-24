var Bricks = function () {

	var bricksData;
	var bricksList;
	var board;
	var boundries = {};
	var message;
	var player;
	var addBrickTimer;
	var brickIndex = 0;
	var soundManager;

	function addBrick() {
		var brick = new SingleBrick();
		brick.create(bricksData[brickIndex], boundries, message, player, soundManager);
		bricksList.push(brick);
		board.appendChild(brick.getElem());
		brickIndex++;
		addBrickTimer = setTimeout(addBrick , 4000);
		if(brickIndex === 2 || brickIndex === 5 ) {
			message(3);
		}
		if(brickIndex === 3 ) {
			message(2);
		}

		bricksData[bricksList.length -1].classList.add ('flying-letter');
		bricksData[bricksList.length -1].style.color = '#fff000';
	}

	function init (bricksArr, boardId, _message, _player, _soundManager) {
		message =_message;
		bricksData = bricksArr;
		bricksList = [];
		board = document.getElementById(boardId);
		
		boundries.x = 0;
		boundries.y = 0;
		boundries.width = board.offsetWidth;
		boundries.height = board.offsetHeight;

		player = _player;
		soundManager = _soundManager;
		addBrick();
		
	}

	function killAll () {
		clearTimeout(addBrickTimer);
		for(var i = 0 ; i < bricksData.length; i++) {
			var elem = bricksData[i];
			if(elem.className.indexOf('flying-letter') != -1) {
				elem.removeAttribute('style');
				elem.classList.remove('flying-letter');
			} 
		};
		bricksList.forEach(function (elem) {
			elem.kill();
		});
	}

	return {
		init: init,
		killAll: killAll
	}
}