(function (window, document) {

	figureController = {
		// include model
		name: 'figure', // DRY
		book: '',
		figures: {},
		figureNames: {},
		collection: function(book, callback){
			this.book = book;
			$.getJSON("./data/figures/"+book+".json", function(figures){
				figureController.figures = figures;
				$.getJSON("./data/figure-names.json", function(figureNames){
					figureController.figureNames = figureNames;
					figureController.onAllLoad();
					callback();
				});
		  });	
		},
		onAllLoad: function(){
			// render menu
			menuModel.load(figureController.figures);
			// load first figure
			// figureModel.currentFigureGet();
		},
		onModelLoad: function(){
			// register helper
			figureController.helpers();
		},
		model: function(){
			injectScript('./assets/models/'+this.name+'.js', {}, this.onModelLoad);
		},
		helpers: function(){
			Handlebars.registerHelper('figure_name', function(object) {
			  return figureController.figureNames[object.data.key];
			});
		},
		view: function(model){
			injectTemplate(this.name, model);
		},
		onload: function(){
			this.model();
		}
	};

	figureController.onload();

}(this, this.document));