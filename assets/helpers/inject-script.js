(function (window, document) {

injectScript = function(url, options, callback) {
  var script = document.createElement('script');
  script.src = url;
  // Make sure the callback is a function​
  if (typeof callback === "function") {
    script.onload = function(){
    	callback(options);
    };
  }
  document.head.appendChild(script);
}

injectHTML = function(url, placeholder){
  $.ajaxSetup({
    crossOrigin: true
  });
  $.get('http://alloworigin.com/get?url=' + 
    encodeURIComponent(url), function(response){
    $(placeholder).html(response.contents);
  });
}

injectTemplate = function(name, data) {
  $.ajaxSetup({
    cache: false
  });
  $.get('./assets/views/'+name+'.html', function(html){
    $('#'+name+'-placeholder').after(html); //use .after to see template, use .html to overwrite later
    var source = $('#'+name+'-template').html();
    var template = Handlebars.compile( source );
    $('#'+name+'-placeholder').html( template( data ) ); 
  });
}

}(this, this.document));