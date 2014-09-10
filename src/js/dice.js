
   /**
     *	Backgammon JS
     *	Dice class
     *
     *	@author		Andrej Babic
     */


;(function(window) {

	// Tärningsklass
	window.Dice = function() {

		// Inherit from superclass
		this.inheritFrom = Backgammon,
		this.inheritFrom(),

		/*
		 *	Rensa tärningarnas nummer
		 */
		this.cleardice = function() {
		
			this.showdie(0,0);
			this.showdie(1,0);
			$("#die0").css("border-bottom", "3px solid #fff");
			$("#die1").css("border-bottom", "3px solid #fff");

		},

		/*
		 *	Slumpa fram tal för båda tärningarna
		 */
		this.rolldice = function() {
	
			var no = Math.floor(Math.random() * 5) + 1;
			this.showdie(0, no);

			no = Math.floor(Math.random() * 5) + 1;
			this.showdie(1, no);

		},


		/*
		 *	Visa nummer på tärning
		 *
		 *	@param		tärning id
		 *	@param		nytt värde
		 */
		this.showdie = function(no, value) {

			this.dice[no] = value;
			$("#die" + no).attr("src", "images/bg_dice_" + value + ".png");

		},


		/*
		 *	Välj tärning
		 *
		 *	@access		public
		 *	@param		tärning id
		 */
		this.choosedie = function(x) {

			if (this.dice[x] == false)
				this.note(this.msg.used_dice);
			else
				this.activedie = x;

			$("#die" + x).css("border-bottom", "3px solid #D5AA7D");

			if (this.jail[this.activeteam] > 0)
				this.jailbreak();

		}

	};

})(window);
