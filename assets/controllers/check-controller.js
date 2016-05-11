(function (window, document) {

	checkController = {
		// include model
		name: 'check', // DRY
		model: function(){
			injectScript('./assets/models/'+this.name+'.js', {}, this.onModelLoad);
		},
		// include view html
		view: function(data){
			injectTemplate(this.name, data);
			injectHTML(checkModel.data.type.taLink, "#taLink");
		},
		onload: function(){
			this.model();
		}
	};

	checkController.onload();

}(this, this.document));