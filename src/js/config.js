
   /**
     *	Backgammon JS
     *	Config
     *
     *	@author		Andrej Babic
     */


;(function(Backgammon) {

	var _config = {};
	
	_config.messages = {
						"choose_dice_first" : {
							"en" : "Please choose a dice first",
							"sv" : "Välj en tärning först",
						},
						"no_pawn_there" : {
							"en" : "You have no pawn there",
							"sv" : "Du har inga pjäser där",
						},
						"used_dice" : {
							"en" : "You have already used that dice",
							"sv" : "Du har redan använt tärningen",
						},
						"cant_move" : {
							"en" : "You can't move there",
							"sv" : "Otillåten flytt",
						},
						"not_all_home" : {
							"en" : "You don't have all your pawns home\nto more here",
							"sv" : "Du har inte alla dina pjäser\nhemma för att flytta hit",
						},
					};


	// Merge config with Backgammon
	Backgammon.msg = _config.messages;

})(BG);