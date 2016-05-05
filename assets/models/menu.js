(function (window, document) {

	menuModel = {
		figures: {},
		figure_names: {},
		load: function(){
			var model = this;
			$.getJSON("./data/figures.json", function(figures){
				model.figures = figures;
				$.getJSON("./data/figure_names.json", function(figure_names){
					model.figure_names = figure_names;
				  Handlebars.registerHelper('figure_name', function(object) {
				    return figure_names[object.data.key];
			  	});
			  	// render view after data is loaded
					model.onLoad(figures);
				});
		  });			
		},
		onLoad: function(model){
			menuController.view(model);
		}
	};

	menuModel.load();

}(this, this.document));