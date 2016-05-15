(function (window, document) {

  targetController = {
    // include model
    name: 'target', // DRY
    model: function(){
      injectScript('./assets/models/'+this.name+'.js', {}, this.onModelLoad);
    },
    onModelLoad: function(){
    },
    onload: function(){
      this.model();
    }
  };

  targetController.onload();

}(this, this.document));