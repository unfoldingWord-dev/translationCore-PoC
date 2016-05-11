(function (window, document) {

	figureController = {
		// include model
		name: 'figure', // DRY
		figures: {},
		figureNames: {},
		model: function(){
			injectScript('./assets/models/'+this.name+'.js', {}, this.onModelLoad);
		},
		helpers: function(){
			Handlebars.registerHelper('figure_name', function(object) {
			  return figureController.figureNames[object.data.key];
			});
		},
		all: function(){
			$.getJSON("./data/figures.json", function(figures){
				figureController.figures = figures;
				$.getJSON("./data/figure-names.json", function(figureNames){
					figureController.figureNames = figureNames;
					figureController.onAllLoad();
				});
		  });	
		},
		onAllLoad: function(){
			// render menu
			menuModel.load(figureController.figures);
			// load first figure
			figureModel.load('metaphor',0);
		},
		onModelLoad: function(){
			// load them all
			figureController.all();
			// register helper
			figureController.helpers();
		},
		// include view html
		view: function(model){
			injectTemplate(this.name, model);
		},
		onload: function(){
			this.model();
		}
	};

	figureController.onload();

}(this, this.document));