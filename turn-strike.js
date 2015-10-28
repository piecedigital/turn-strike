"use strict";

process.stdin.setEncoding("utf8");
const util = require("util");
// enables user's ability to type
const typeTrue = function() {
	process.stdin.resume();
};
// disables user's ability to type
const typeFalse = function() {
	process.stdin.pause();
};
// prompts user input
const prompt = function(dialog) {
	console.log(dialog);
	typeTrue();
}

const getAction = "What is your next move?\r\n\r\n";

/////////////////////////////////////// game
// the event taking place
var event = "getName";
// the turn for action of  entity (player/boss)
var turn = "player";

// player data (name, health)
var player = {
	name: "",
	hp: 1000,
	strength: 100,
	optionBelt: {
		0: "attack",
		attack: {
			0: "magic",
			magic: {
				0: "ice",
				ice: function(name) {
					name = "ice";
					var actObj = {
						dmg: 80,
						effect: "slow",
						turns: 1
					};

					console.log(`Chose to attack with "${name}"!\r\n`);
				},
				1: "fire",
				fire: function(name) {
					name = "fire";
					var actObj = {
						dmg: 60,
						effect: "dot",
						dotDmg: 5,
						turns: 4
					};

					console.log(`Chose to attack with "${name}"!\r\n`);
					quit();
				}
			},
			1: "physical",
			physical: {
				0: "sword",
				sword: function(name) {
					name = "sword";
					var actObj = {
						dmg: 80,
						hitChance: 50
					};

					console.log(`Chose to attack with "${name}"!\r\n`);
					quit();
				},
				1: "hammer",
				hammer: function(name) {
					name = "hammer";
					var actObj = {
						dmg: 120,
						hitChance: 75
					};

					console.log(`Chose to attack with "${name}"!\r\n`);
					quit();
				}
			}
		},
		1: "utility",
		utility: {
			0: "heal",
			1: "buff",
			buff: {
				0: "damage",
				damage: function(name) {
					name = "damage";
					console.log(`Chose to buff "${name}"!\r\n`);
					quit();
				},
				1: "defense",
				defense: function(name) {
					name = "defense";
					console.log(`Chose to buff "${name}"!\r\n`);
					quit();
				}
			}
		}
	}
}

// all of the bosses to be picked at random
var bosses = [
	{
		name: "Madusa",
		hp: 1000,
		strength: 100,
		attacks: [
			function() {
				turn = "player";
				console.log(`${boss.name} did something!\r\n`);
				quit();
			}
		]
	}
];

// to be the current boss
var boss = {};

let reference = player.optionBelt;


prompt(`What is your name?`);

process.stdin.on('data', function (text) {

	let getAction = function() {
		// events for battle
		if(event === "battle") {
			// checks if turn is for player
			if(turn === "player") {
				let options = [];

				if(typeof reference === "function") {
					typeFalse();
					
					// does the current action of the player
					reference();
					
					// sets the turn to the boss
					turn = "boss";

					// gets a new actions
					//getAction();
				} else
				if(typeof reference === "object") {
					for(let key in reference) {
						if(typeof reference[key] === "string") {
							options.push(reference[key] + `[${key}]`);
						}
					}

					console.log(`Choose a(n) action\r\n`);
					prompt("| " + options.join(" | ") + " |");
				}
			}

			// checks if turn is for boss
			if(turn === "boss") {
				console.log(`It's the ${boss.name.match(/s$/i) ? boss.name + "'" : boss.name + "'s"} turn!\r\n`);
				boss.attacks[Math.round( Math.random() * (boss.attacks.length-1) )]();
			}
		}
	};

	// sets the player's name
	if(event === "getName") {
		player.name = text.match(/^([a-z]*)/i).pop();
		
		typeFalse();

		console.log(`\r\nHello ${player.name}. Welcome to Turn/Strike, a CLI turn-based combat game where you fight a random boss every round.\r\n\r\n`);
		setTimeout(function() {
			console.log("Your next fight is with...\r\n\r\n");
			setTimeout(function() {
				let num = Math.round( Math.random() * (bosses.length-1) );
				boss = bosses[num];

				console.log(`${boss.name}!\r\n\r\n`);
				event = "battle";

				setTimeout(function() {
					console.log(`${boss.name} stands before you.\r\n\r\n`);

					console.log(`What is your next move?\r\n\r\n`);
					getAction();
				}, 1000);
			}, 1000);
		}, 1000);
	}

	if(text.match(/^[0-9]/i)) {
		let t = text.match(/^([0-9])/i).pop();
		console.log(`\r\nChose: ${reference[t]}\r\n`);
		//console.log(`Choose a(n) ${reference[t]} action\r\n`);
		//console.log(reference[t], reference[reference[t]]);

		reference = reference[reference[t]];

		getAction();
	}


  // quit
  if (text === 'quit\r\n') {
    quit();
  }
});

function quit() {
  console.log('Come again!');
  process.exit();
}