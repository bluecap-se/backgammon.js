
   /**
     *	Backgammon JS
     *	Main class
     *
     *	@author		Andrej Babic
     */

;(function(window){

	// Spelklass
	window.Backgammon = function() {

		this.possession = [],
		this.howmany = [],
		this.jail = [],
		this.finished = [],
		this.allhome = [],
		this.movefactor = [],
		this.dice = [],
		
		this.msg = "",
		this.lang = (window.navigator.userLanguage || window.navigator.language).substring(0, 2),

		this.player = {}
		this.player.white = {
			"jail": 0,
			"home": 0,
			"finished": 0,
			"movefactor": 1
		},
		
		this.player.black = {
			"jail": 0,
			"home": 0,
			"finished": 0,
			"movefactor": -1
		},

		this.started = false,
		this.activedie,
		this.activeteam,
		this.enemy;

	};


	window.Backgammon.prototype = {

		/*
		 *	Constructor
		 */
		construct: function() {

			this.jail["white"] = 0;
			this.jail["black"] = 0;

			this.finished["white"] = 0;
			this.finished["black"] = 0;

			this.allhome["white"] = false;
			this.allhome["black"] = false;

			// White begins
			this.movefactor["white"] = 1;
			this.movefactor["black"] = -1;

			// Dices not rolled
			this.dice[0] = false;
			this.dice[1] = false;

			for (x=0; x<24; x++) {
				this.possession[x] = 0;
				this.howmany[x] = 0;
			}

			// Place the pieces
			this.setchips(0, "white", 2);
			this.setchips(11, "white", 5);
			this.setchips(16, "white", 3);
			this.setchips(18, "white", 5);
			this.setchips(23, "black", 2);
			this.setchips(12, "black", 5);
			this.setchips(7, "black", 3);
			this.setchips(5, "black", 5);

			this.changeteams("white", "black");

		},


		/*
		 *	Skapa spelplan & börja spela
		 *
		 *	@access		public
		 */
		start: function() {

			if (!this.started) {

				this.draw_playfield();
				this.construct();

				this.cleardice();
				this.rolldice();
				this.started = true;
			}

		},


		/*
		 *	Placera spelmarker
		 *
		 *	@param		position
		 *	@param		spelare
		 *	@param		antal marker
		 */
		setchips: function(pos, player, no) {
	
			var img;
			
			if (no == 0) {
				this.possession[pos] = 0;
				img = "empty";
			} else {
				this.possession[pos] = player;
				img = player + no;
			}
		
			this.howmany[pos] = no;
			$("#spot" + pos).css("background-image", 'url(images/bg_' + img + ".png)");
	
		},


		/*
		 *	Välj spelmarker
		 *
		 *	@access		public
		 *	@param		marker
		 */
		choosechip: function(x) {

			if (this.activedie == "none") {
				this.note(this.msg.choose_dice_first);
			} else if ((this.howmany[x] == 0) || (this.possession[x] != this.activeteam)) {
				this.note(this.msg.no_pawn_there);
			} else {
				 this.movechip(x, this.dice[this.activedie], this.activedie);
			}

		},


		/*
		 *	Ut ur fängelse
		 */
		jailbreak: function() {

			var img;
			this.jailspot = (this.activeteam == "white") ? -1 : 24;

			if (this.movechip(this.jailspot, this.dice[this.activedie], this.activedie)) {
				this.jail[this.activeteam]--;
				img = 'images/bg_' + ((this.jail[this.activeteam] > 0) ? this.activeteam + this.jail[this.activeteam] : 'empty') + ".png";

				$("#" + this.activeteam + "jail").attr("src", img);
			}

		},


		/*
		 *	Draw play field
		 */
		draw_playfield: function() {

			var out = '<table border="0" cellpadding="0" cellspacing="0" id="playfield">',
				   x = 0;

			for (; x < 12; x++) {
				out += '<td><div style="height:280px; background:url(images/bg_' + (x%2==0 ? 'light' : 'dark') + '_t.png) no-repeat top left"><div data-marker="' + x + '" class="chip s" id="spot' + x + '"></div></div>';
				out += '<div style="height:276px; background:url(images/bg_' + ((23-x)%2==0 ? 'light' : 'dark') + '_b.png) no-repeat bottom left"><div data-marker="' + (23 - x) + '" class="chip sb" id="spot' + (23-x) + '"></div></div></td>';
			}

			$("#field").html(out + '</table>');

		},


		/*
		 *	Flytta spelmarker
		 *
		 *	@param		från
		 *	@param		antal steg
		 *	@param		tärning ID
		 *	@return		Boolean
		 */
		movechip: function(from, howfar, die) {

			var newspot = from + (this.movefactor[this.activeteam] * howfar);
			var placename;
			if ((from > -1) && (from < 24)) {
				placename = "position " + from;
			} else {
				var fromjail = true;
				placename = "jail";
			}

			if (this.possession[newspot] == this.enemy) {
				if (this.howmany[newspot] > 1) {
					this.note(this.msg.cant_move);
					return false;
				} else {
					this.imprison(newspot, this.enemy);
				}
			}  

			if ((newspot > 23) || (newspot < 0)) {
				if (!this.allhome[this.activeteam]) {
					this.note(this.msg.not_all_home);
					return false;
				}
			}


			var newcountfrom = (this.howmany[from] - 1);
			var newcountto = (this.howmany[newspot] + 1);
			
			if (!fromjail) {
				this.setchips(from, this.activeteam, newcountfrom);
			}
		
			this.setchips(newspot, this.activeteam, newcountto);

			this.dice[this.activedie] = false;
			this.activedie = "none";

			$("#die" + die).css("border-bottom", "3px solid #633821");


			if (this.dice[0] == false && this.dice[1] == false) {
				this.changeteams(this.enemy, this.activeteam);
				this.rolldice();
			}

			return true;

		},


		/*
		 *	Släng spelmarken i fängelse
		 *
		 *	@param		ursprunglig position
		 *	@param		spelare
		 */
		imprison: function(from, player) {

			this.setchips(from, player, 0);
			this.jail[player]++;
			$("#" + player + "jail").attr("src", 'images/bg_' + player + this.jail[player] + ".png");

		},

		/*
		 *	Switch player
		 *
		 *	@param		next player
		 *	@param		prev player
		 */
		changeteams: function(newp, old) {

			this.activeteam = newp;
			this.enemy = old;

			$("#header_white").css("font-weight", "normal");
			$("#header_black").css("font-weight", "normal");
			$("#header_" + this.activeteam).css("font-weight", "bold");
			$("#drag").attr("src", 'images/bg_user_' + this.activeteam + '.png');
		
			this.cleardice();
			this.activedie = "none";
		
		},
		
		note: function(message) {
		
			echo = message[this.lang] || message;
			alert(echo);
		
		}

	};

})(window);
