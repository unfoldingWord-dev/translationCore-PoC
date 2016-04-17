(function (window, document) {
  Handlebars.registerHelper('figure_name', function(figure_id) {
    return checking.figure_data[figure_id.data.key].name;
  });

  var source = $("#menu-template").html();
  var template = Handlebars.compile( source );
  $("#menu-placeholder").html( template( figures ) ); 
  checking.update("metaphor", 1, 0);
}(this, this.document));