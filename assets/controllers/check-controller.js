(function (window, document) {

	checkController = {
		// include model
		name: 'check', // DRY
		model: function(){
			var name = this.name;
			$.getScript('./assets/models/'+name+'.js', function(app_data, textStatus, jqxhr){
				// call view from async code in model
			});
		},
		// include view html
		view: function(model){
			var name = this.name;
			$.get('./assets/views/'+name+'.html', function(data){
		    $('#'+name+'-placeholder').html(data); //use .after to see template, use .html to overwrite later
		  	var source = $('#'+name+'-template').html();
			  var template = Handlebars.compile( source );
			  $('#'+name+'-placeholder').html( template( model ) ); 
			});
		}
	};

	checkController.model();

}(this, this.document));