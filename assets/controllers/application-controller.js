(function (window, document) {

	applicationController = {
		// include model
		name: 'application', // DRY
		model: function(){
			injectScript('./assets/models/'+this.name+'.js', {}, this.onModelLoad);
		},
		onModelLoad: function(){
			applicationController.view(applicationModel);
			applicationController.controllers();
		},
		// include view html
		view: function(model){
			injectTemplate(this.name, model);
		},
		controllers: function(){
			var controllers = applicationModel.controllers;
			$.each(controllers, function(index,controller){
				injectScript('./assets/controllers/'+controller+'-controller.js');
			});
		},
		onload: function(){
			this.model();
		}
	};

	applicationController.onload();

}(this, this.document));