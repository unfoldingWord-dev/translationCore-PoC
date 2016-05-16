(function (window, document) {

	figureModel = {
		data: {
			index: null,
      quote: null,
      notes: null,
      reference: {
        book: null,
        chapter: null,
        chunk: null,
        verse: null
      },
			type: {
				id: null,
				name: null,
				taLink: null,
				vol: null
			}
    },
		// register helpers accessible to template
		load: function(typeId, index){
      this.currentFigureSet(typeId, index);
      var data = figureController.figures[typeId][index];
      var type = {
        id: typeId,
        vol: data.vol,
        name: figureController.figureNames[typeId],
        taLink: this.taLink(typeId, data.vol)
      }
			data.index = index;
			// persist the data
			data.type = type;
			this.data = data;

			this.onload();
		},
    currentFigureSet: function(figureType, currentIndex){
      cacheSet('currentFigure', {id: figureType, index: currentIndex}, function(){});
    },
    currentFigureGet: function(){
      cacheGet('currentFigure', {id: 'metaphor', index: 0}, function(value){
        figureModel.load(value.id, value.index);
      });
    },
    taLink: function(type, vol){
      return "https://door43.org/_export/xhtmlbody/en/ta/vol"+vol+"/translate/figs_"+type
    },
		// set callbacks to happen after data returns
		onload: function(){
			// populate checking model
      targetModel.load();
    },
    onTargetModelLoad: function(){
			checkModel.load(this.data);
    }
	};

}(this, this.document));