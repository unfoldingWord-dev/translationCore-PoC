(function (window, document) {

  targetController = {
    // include model
    name: 'target', // DRY
    targetManifests: [
      // "manifest.json"
    ],
    targets: {
      // { manifest }
    },
    collection: function(){
      $.getJSON("./data/"+this.name+"s.json", function(manifests){
        targetController.targetManifests = manifests;
        $.each(manifests, function(index, manifest){
          targetModel.parseManifest(manifest, function(_manifest){
            var targets = targetController.targets;
            var language = _manifest.target_language.name;
            var book = _manifest.project.name;
            if (targets[language] === undefined){ targets[language] = {} }
            targetController.targets[language][book] = _manifest;
            targetController.view(targetController);
          });
        });
      });
    },
    view: function(data){
      injectTemplate(this.name+"s", data);
    },
    loadTargetModel: function(language, book){
      var manifest = this.targets[language][book];
      targetModel.load(manifest);
    },
    model: function(){
      injectScript('./assets/models/'+this.name+'.js', {}, this.onModelLoad);
    },
    onModelLoad: function(){
      targetController.collection();
    },
    onload: function(){
      this.model();
    }
  };

  targetController.onload();

}(this, this.document));