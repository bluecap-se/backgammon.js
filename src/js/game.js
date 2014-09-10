
/**
 * Backgammon JS
 *
 * @author	Andrej Babic
 */

;(function(){

    paper.install(window);
    // Keep global references to both tools, so the HTML
    // links below can access them.
    var tool1, tool2;

    window.onload = function() {
        paper.setup("backgammon");

        // Create two drawing tools.
        // tool1 will draw straight lines,
        // tool2 will draw clouds.

		// Create a raster item using the image tag with id='mona'
		var img = new Image(28, 26);
		img.src = "images/dice_2.png";
		var raster = new Raster(img);
		
		// // Move the raster to the center of the view
		raster.position = view.center;
		
		// // Scale the raster by 200%
		raster.scale(2);
		
		// // Rotate the raster by 45 degrees:
		raster.rotate(90);

        // Both share the mouseDown event:
        var path;
        function onMouseDown(event) {
            path = new Path();
            path.strokeColor = 'black';
            path.add(event.point);
        }

        tool1 = new Tool();
        tool1.onMouseDown = onMouseDown;

        tool1.onMouseDrag = function(event) {
            path.add(event.point);
        }

        tool2 = new Tool();
        tool2.minDistance = 20;
        tool2.onMouseDown = onMouseDown;

        tool2.onMouseDrag = function(event) {
            // Use the arcTo command to draw cloudy lines
            path.arcTo(event.point);
        }
    }

/*
	$(document).ready(function(){

        // Get a reference to the canvas object
        var canvas = $("#backgammon").get(0);
        // Create an empty project and a view for the canvas:
        paper.setup(canvas);
        // Create a Paper.js Path to draw a line into it:
        var path = new paper.Path();
        // Give the stroke a color
        path.strokeColor = "black";
        var start = new paper.Point(100, 100);
        // Move to start and draw a line from there
        path.moveTo(start);
        // Note that the plus operator on Point objects does not work
        // in JavaScript. Instead, we need to call the add() function:
        path.lineTo(start.add([ 200, -50 ]));
        // Draw the view now:
        paper.view.draw();
	
	});
*/

	// Spelklass
	function Backgammon() {

		this.possession = [],
		this.howmany = [],
		this.jail = [],
		this.finished = [],
		this.allhome = [],
		this.movefactor = [],
		this.dice = [],
		this.olddice = [],

		this.started = 0,
		this.activedie,
		this.activeteam,
		this.enemy;

	}

		/*
		 *	Konstruktor
		 */
		this.construct = function() {

			this.jail["white"] = 0;
			this.jail["black"] = 0;

			this.finished["white"] = 0;
			this.finished["black"] = 0;

			this.allhome["white"] = false;
			this.allhome["black"] = false;

			// Vit börjar
			this.movefactor["white"] = 1;
			this.movefactor["black"] = -1;

			// Tärningarna ej rullade
			this.dice[0] = false;
			this.dice[1] = false;

			for (var x=0; x<24; x++) {
				this.possession[x] = 0;
				this.howmany[x] = 0;
			}

			// Placera ut pjäser
			this.setchips(0, "white", 2);
			this.setchips(11, "white", 5);
			this.setchips(16, "white", 3);
			this.setchips(18, "white", 5);
			this.setchips(23, "black", 2);
			this.setchips(12, "black", 5);
			this.setchips(7, "black", 3);
			this.setchips(5, "black", 5);

			this.changeteams("white", "black");

		};


		/*
		 *	Skapa spelplan & börja spela
		 *
		 *	@access		public
		 */
		this.start = function() {

			if (this.started === 0) {
				this.writeboard();
				this.construct();

				this.cleardice();
				this.rolldice();
				this.started = 1;
			}

		};


		/*
		 *	Placera spelmarker
		 *
		 *	@param		position
		 *	@param		spelare
		 *	@param		antal marker
		 */
		this.setchips = function(pos, player, no) {
	
			var img;
			
			if (no == 0) {
				this.possession[pos] = 0;
				img = "empty";
			}
			else {
				this.possession[pos] = player;
				img = player + no;
			}
		
			this.howmany[pos] = no;
			$("spot" + pos).attr("background-image", "url(media/bg_" + img + ".png");
	
		};


		/*
		 *	Välj spelmarker
		 *
		 *	@access		public
		 *	@param		marker
		 */
		this.choosechip = function(x) {

			if (this.activedie == "none") {
				alert("Välj en tärning först");
			}
			else if ((this.howmany[x] == 0) || (this.possession[x] != this.activeteam)) {
				alert("Du har inga pjäser där");
			}
			else {
				 this.movechip(x, this.dice[this.activedie], this.activedie);
			}

		};


		/*
		 *	Ut ur fängelse
		 */
		this.jailbreak = function() {

			var img;
			this.jailspot = (this.activeteam == "white") ? -1 : 24;

			if (this.movechip(this.jailspot, this.dice[this.activedie], this.activedie)) {
				this.jail[this.activeteam]--;
				img = 'media/bg_' + ((this.jail[this.activeteam] > 0) ? this.activeteam + this.jail[this.activeteam] : 'empty') + ".png";

				$(this.activeteam + "jail").src = img;
			}

		};


		/*
		 *	Rita upp spelfältet
		 */
		this.writeboard = function() {

			var out = '<table border="0" cellpadding="0" cellspacing="0" id="playfield">';

			for (x=0; x<12; x++) {
				out += '<td><div style="height:280px; background:url(media/bg_' + (x%2==0 ? 'light' : 'dark') + '_t.png) no-repeat top left"><div onclick="BG.choosechip(' + x + ')" class="s" id="spot' + x + '"></div></div>';
				out += '<div style="height:276px; background:url(media/bg_' + ((23-x)%2==0 ? 'light' : 'dark') + '_b.png) no-repeat bottom left"><div onclick="BG.choosechip(' + (23-x) + ')" class="sb" id="spot' + (23-x) + '"></div></div></td>';
			}

			$('field').innerHTML = out + '</table>';

		};


		/*
		 *	Flytta spelmarker
		 *
		 *	@param		från
		 *	@param		antal steg
		 *	@param		tärning ID
		 *	@return		Boolean
		 */
		this.movechip = function(from, howfar, die) {

			var newspot = from + (this.movefactor[this.activeteam] * howfar),
			    placename;

			if ((from > -1) && (from < 24)) {
				placename = "position " + from;
			}
			else {
				var fromjail = true;
				placename = "jail";
			}

			if (this.possession[newspot] == this.enemy) {
				if (this.howmany[newspot] > 1) {
					alert("Otillåten flytt");
					return false;
				}
				else {
					this.imprison(newspot, this.enemy);
				}
			}  

			if ((newspot > 23) || (newspot < 0)) {
			  if (!this.allhome[this.activeteam]) {
				alert("Du har inte alla\ndina pjäser hemma\nför att flytta hit");
				return false;
			  }
			}

			var newcountfrom = (this.howmany[from] - 1),
			    newcountto = (this.howmany[newspot] + 1);

			if (!fromjail) {
				this.setchips(from, this.activeteam, newcountfrom);
			}
		
			this.setchips(newspot, this.activeteam, newcountto);
		
			this.olddice[this.activedie] = this.dice[this.activedie];
			this.dice[this.activedie] = false;
			this.activedie = "none";

			$("#die" + die).attr("border-bottom", "3px solid #633821");


			if (this.dice[0] == false && this.dice[1] == false) {
				this.changeteams(this.enemy, this.activeteam);
				this.rolldice();
			}

			return true;

		};


		/*
		 *	Släng spelmarken i fängelse
		 *
		 *	@param		ursprunglig position
		 *	@param		spelare
		 */
		this.imprison = function(from, player) {

			this.setchips(from, player, 0);
			this.jail[player]++;
			$(player + "jail").attr("src", 'media/bg_' + player + this.jail[player] + ".png");

		};


		/*
		 *	Byt spelare
		 *
		 *	@param		förra spelaren
		 *	@param		nya spelarer
		 */
		this.changeteams = function(newp, old) {
		
			this.activeteam = newp;
			this.enemy = old;
			
			$("#header_white").css("font-weight", "normal");
			$("#header_black").css("font-weight", "normal");
			$("#header_" + this.activeteam).css("font-weight", "bold");
			$("#drag").attr("src", 'media/bg_user_' + this.activeteam + '.png');
		
			this.cleardice();
			this.activedie = "none";
		
		};


	};


	// Tärningsklass
	function Dice() {

		// Ärv från huvudklassen
		this.inheritFrom = Backgammon;
		this.inheritFrom();


		/*
		 *	Slumpa fram tal för båda tärningarna
		 */
		this.rolldice = function() {
	
			var no = Math.floor(Math.random() * 5) + 1;
			this.showdie(0, no);

			var no = Math.floor(Math.random() * 5) + 1;
			this.showdie(1, no);

		};


		/*
		 *	Rensa tärningarnas nummer
		 */
		this.cleardice = function() {
	
			this.showdie(0,0);
			this.showdie(1,0);
			this.olddice[0] = 0;
			this.olddice[1] = 0;

			$("#die0").css("border-bottom", "3px solid #fff");
			$("#die1").css("border-bottom", "3px solid #fff");

		};


		/*
		 *	Visa nummer på tärning
		 *
		 *	@param		tärning id
		 *	@param		nytt värde
		 */
		this.showdie = function(no, value) {

			this.dice[no] = value;
			$("#die" + no).attr("src", "media/bg_dice_" + value + ".png");

		};


		/*
		 *	Välj tärning
		 *
		 *	@access		public
		 *	@param		tärning id
		 */
		this.choosedie = function(x) {

			if (this.dice[x] == false) {
				alert("Du har redan\nanvänt tärningen");
			}
			else {
				this.activedie = x;
			}

			$("#die" + x).css("border-bottom", "3px solid #D5AA7D");

			if (this.jail[this.activeteam] > 0) {
				this.jailbreak();
			}

		};


	}


	// Skapa instans
	Dice.prototype = new Backgammon();
	var BG = new Dice();

})(window);
