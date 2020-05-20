app.controller('mainCtrl', function ($scope, $timeout, $interval) {

	$scope.model = {
		game: {}
	};

	$scope.model.game.rings = [
		{ seed: null, animation: '', class: 'ring'},
		{ seed: null, animation: '', class: 'ring'},
		{ seed: null, animation: '', class: 'ring'}
	]
		

	$scope.model.game.SYMBOLS_PER_REEL = 6;
	$scope.model.game.REEL_RADIUS = 67

	$scope.model.game.createSymbols = function (ring) {
		ring.symbols = [];

		var symbolAngle = 360 / $scope.model.game.SYMBOLS_PER_REEL;

		for (var i = 0; i < $scope.model.game.SYMBOLS_PER_REEL; i++) {
			ring.symbols.push({
				transform: 'rotateX(' + (symbolAngle * i) + 'deg) translateZ(' + $scope.model.game.REEL_RADIUS + 'px)',
			})

			if (i === 0) {
				ring.symbols[i].text = '🍒';
			} if (i === 1) {
				ring.symbols[i].text = '💲';
			} if (i === 2) {
				ring.symbols[i].text = '💎';
			} if (i === 3) {
				ring.symbols[i].text = '🎲';
			} if (i === 4) {
				ring.symbols[i].text = '🍋';
			} if (i === 5) {
				ring.symbols[i].text = '⭐';
			}

		}
	}

	$scope.model.game.spin = function (timer) {

		var getSeed = function () {
			var emojis = [0, 1, 2, 3, 4, 5];
			var emojisWeight = [10, 2, 3, 1, 2, 3];
			var totalWeight = eval(emojisWeight.join("+"));
			var weighedEmojis = new Array();
			var currentEmoji = 0;

			while (currentEmoji < emojis.length) {
				for (j = 0; j < emojisWeight[currentEmoji]; j++)
					weighedEmojis[weighedEmojis.length] = emojis[currentEmoji];
				currentEmoji++;
			}

			var randomnumber = Math.floor(Math.random() * totalWeight);
			return (weighedEmojis[randomnumber]);
		}

		for (var i = 0; i < $scope.model.game.rings.length; i++) {
			var oldSeed = -1;
			
			if ($scope.model.game.rings[i].seed != null) {
				oldSeed = $scope.model.game.rings[i].seed;
			}
			var seed = getSeed();

			$scope.model.game.rings[i].seed = seed;

			if (oldSeed == seed) {
				$scope.model.game.rings[i].animation = '';
				$scope.model.game.rings[i].class = 'ring';

				trickCss($scope.model.game.rings[i], seed, timer);
			}
			else {
				$scope.model.game.rings[i].animation = 'back-spin 1s, spin-' + seed + ' ' + (timer + i * 0.5) + 's';
				$scope.model.game.rings[i].class = 'ring spin-' + seed;
            }
		}
	}

	function trickCss(ring, seed, timer) {
		$timeout(function () {
			ring.animation = 'back-spin 1s, spin-' + seed + ' ' + (timer + i * 0.5) + 's';
			ring.class = 'ring spin-' + seed;
		}, 30);
	}


	$scope.model.game.topLightColors = ['red', 'yellow', 'green', 'blue'];


	var payoutSound = new Audio('Jackpot/content/dist/sounds/payout.wav');
	payoutSound.loop = true;

	var reelsSound = new Audio('Jackpot/content/dist/sounds/reels.wav');

	$scope.model.game.onRestartClick = function () {
		payoutSound.pause();
		payoutSound.currentTime = 0;

		reelsSound.pause();
		reelsSound.currentTime = 0;

		reelsSound.play();


		$scope.model.game.startPending = true;
		$timeout(function () {
			$scope.model.game.startPending = false;
		}, 1000)

		$scope.model.game.lightsAnimationPending = true;
		$timeout(function () {
			$scope.model.game.lightsAnimationPending = false;
		}, 2500)

		function arrayRotate(arr, reverse) {
			if (reverse) arr.unshift(arr.pop());
			else arr.push(arr.shift());
			return arr;
		}

		var rotateLights = function (delay) {
			$timeout(function () {
				if ($scope.model.game.lightsAnimationPending) {
					arrayRotate($scope.model.game.topLightColors, true);

					delay += 10;
					rotateLights(delay);
				}
			}, delay)
        }


		rotateLights(50);
		
		var timer = 2;
		$scope.model.game.spin(timer);

		var sameSeeds = true;
		for (var i = 0; i < $scope.model.game.rings.length; i++) {

			if (i > 0 && $scope.model.game.rings[i - 1].seed !== $scope.model.game.rings[i].seed) {
				sameSeeds = false;
			}
		}

		if (sameSeeds) {
			$timeout(function () {
				$scope.model.game.gameWon = true;

				var wonSound = new Audio('Jackpot/content/dist/sounds/won.mp3');
				wonSound.play();
				
				payoutSound.play();
			}, 3500)
		}
		else {
			$scope.model.game.gameWon = false;
		}

		var trickTimout = function (item) {
			$timeout(function () {
				item.animate = true;
			}, 3500 + (Math.random().toFixed(2) * 1000));
        }

		$scope.model.game.coinAnimations = [];
		for (var k = 0; k < 6; k++) {
			$scope.model.game.coinAnimations.push({ id: k, animate: false });
			trickTimout($scope.model.game.coinAnimations[k]);
		}

		
	};

	
	
	for (var i = 0; i < $scope.model.game.rings.length; i++) {

		$scope.model.game.createSymbols($scope.model.game.rings[i]);
	} 

	var vert = 'SPIN'.split("").join("<br/>")
	$('#vert').html(vert);

});


