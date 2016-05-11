(function (window, document) {

	menuController = {
		// include model
		name: 'menu', // DRY
		model: function(){
			injectScript('./assets/models/'+this.name+'.js');
		},
		// include view html
		view: function(data){
			injectTemplate(this.name, data);
		},
		onload: function(){
			this.model();
		}
	};

	menuController.onload();

}(this, this.document));