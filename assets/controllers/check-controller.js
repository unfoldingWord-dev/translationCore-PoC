(function (window, document) {

	checkController = {
		// include model
		name: 'check', // DRY
		model: function(){
			injectScript('./assets/models/'+this.name+'.js', {}, this.onModelLoad);
		},
		// include view html
		view: function(data){
			checkModel.helpers();
			injectTemplate(this.name, data);
			// injectHTML(checkModel.source.type.taLink, "#taLink");
		},
		reloadView: function(data){
			renderTemplate(this.name, data);
		},
		onload: function(){
			this.model();
		}
	};

	checkController.onload();

}(this, this.document));