
   /**
     *	Backgammon JS
     *	Main
     *
     *	@author		Andrej Babic
     */



	// Skapa instans
	window.Dice.prototype = new window.Backgammon();
	var BG = new Dice();

	$(document).ready(function() {

		var canvas = $("#backgammon").get(0);
		var stage = new Stage(canvas);


		$("#die_one").bind("click", function(e){
			e.preventDefault();
			BG.choosedie(0);
		});

		$("#die_two").bind("click", function(e){
			e.preventDefault();
			BG.choosedie(1);
		});

		$("#start_btn").bind("click", function(e){
			e.preventDefault();
			BG.start();
		});
		
		$("#field").delegate(".chip", "click", function() {
			marker = $(this).data("marker");
			BG.choosechip(marker);
		});

	});
