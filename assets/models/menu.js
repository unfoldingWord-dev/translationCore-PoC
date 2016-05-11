(function (window, document) {

	menuModel = {
		// data for default/top part of menu
		load: function(data){
		  this.onload(data);
		},
		onload: function(data){
			menuController.view(data);
		}
	};

}(this, this.document));