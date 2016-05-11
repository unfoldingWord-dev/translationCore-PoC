(function (window, document) {

	checkModel = {
    gnt: [],
    verses: {
      // "Bible Name": "Verse text goes here."
    },
    showPrev: false,
    showNext: true,
    data: {
      // index: null,
      // quote: null,
      // notes: null,
      // reference: {
      //   book: null,
      //   chapter: null,
      //   chunk: null,
      //   verse: null
      // },
      // type: {
      //   id: null,
      //   name: null,
      //   taLink: null,
      //   vol: null
      // }
    },
    saveData: {
      // metaphor: {
      //   Luke: {
      //     "1": {
      //       "1": {
      //         quote: "",
      //         retained: ""
      //       }
      //     }
      //   }
      // }
    },
    helpers: function(){
      Handlebars.registerHelper('nextId', function(object) {
        return checkModel.currentIndex + 1;
      });
      Handlebars.registerHelper('prevId', function(object) {
        return checkModel.currentIndex - 1;
      });
    },
    figure_link: function(type, vol){
      return "https://door43.org/_export/xhtmlbody/en/ta/vol"+this.data.meta.vol+"/translate/figs_"+this.data.meta.type;
    },
    getVerses: function(){
      var verses = {};
      var reference = this.data.reference;
      $.each(referenceBibles, function(name, bible){
        var quotes = checkModel.data.quote.split('...');
        quotes.push(checkModel.data.quote);
        var verse = bible[reference.book][reference.chapter][reference.verse];
        $.each(quotes, function(index, quote){
          verse = verse.replace(quote, '<strong>'+quote+'</strong>');
        });
        verses[name] = verse;
      });
      this.verses = verses;
    },
    getGNT: function(){
      var reference = this.data.reference;
      this.gnt = glade[reference.book][reference.chapter][reference.verse];
    },
    goToNext: function(){
      if (this.save()) {
        figureModel.load(this.data.type.id, (this.data.index + 1));
      }
    },
    goToPrev: function(){
      if (this.save()) {
        figureModel.load(this.data.type.id, (this.data.index - 1));
      }
    },
		load: function(data){
      this.data = data;
      this.loadSaveData();
      if (this.data.index > 0) { this.prev = true; } else { this.prev = false; }
      this.onload();
		},
		onload: function(){
      this.helpers();
      if (this.data.index !== null) {
        this.getGNT();
        this.getVerses();
        checkController.view(this);
      }
		},
    reload: function(){
      this.load(this.data);
    },
    loadToUI: function(){
      var quote = this.saveData[this.data.type.id][this.data.reference.book][this.data.reference.chapter][this.data.reference.verse].quote;
      $('#quote').val(quote);
      var retained = this.saveData[this.data.type.id][this.data.reference.book][this.data.reference.chapter][this.data.reference.verse].retained;
      $("input:radio[name='optionStatus'][value=" + retained + "]").prop('checked', true);
    },
    selectQuote: function(){
      var text = this.getSelectedText();
      if (text == "") {
        alert("No text is selected to copy into the textbox.")
      } else {
        // check to see if quote is in verse
        var versions = Object.keys(this.verses);
        var translatedVersion = versions[versions.length-1];
        var translation = this.verses[translatedVersion];
        if (~translation.indexOf(text)) {
          // save the quote and reload
          this.prepSaveData();
          this.saveData[this.data.type.id][this.data.reference.book][this.data.reference.chapter][this.data.reference.verse].quote = text;
          this.save();
          // highlight the verse by reloading, todo: not reload the entire check template
          // this.reload();
          $('#quote').val(text);   
        } else {
          // alert if quote not found
          alert("The quote must come from the target translation.");
          return false;
        }
      }
    },
    getSelectedText: function (){
      if ( window.getSelection ) {
          return window.getSelection().toString();
      }
      else if ( document.getSelection ) {
          return document.getSelection();
      } else if ( document.selection ) {
          return document.selection.createRange().text;
      }
    },
    onSelectRetained: function(){
      this.prepSaveData();
      var retained = $("input:radio[name='optionStatus']:checked").val();
      this.saveData[this.data.type.id][this.data.reference.book][this.data.reference.chapter][this.data.reference.verse].retained = retained;
      this.save();
    },
    prepSaveData: function(){
      var type = this.data.type.id;
      var book = this.data.reference.book;
      var chapter = this.data.reference.chapter.toString();
      var verse = this.data.reference.verse.toString();
      if (this.saveData[type] === undefined){ this.saveData[type] = {} }
      if (this.saveData[type][book] === undefined){ this.saveData[type][book] = {} }
      if (this.saveData[type][book][chapter] === undefined){ this.saveData[type][book][chapter] = {} }
      if (this.saveData[type][book][chapter][verse] === undefined){ this.saveData[type][book][chapter][verse] = {} }
    },
    loadSaveData: function(){
      localforage.getItem('checkData', function(err, value){
        if (err) { console.log(err); } else {
          if (value !== null) {
            console.log(value);
            checkModel.saveData = value;
            // TODO: move this somewhere more appropriate
            checkModel.loadToUI();
          } else {
            console.log('localStorage checkData is empty.')
            checkModel.saveData = defaultValue;
          }
        }
      });
    },
    save: function(){
      localforage.setItem('checkData', this.saveData, function (err) {
        if (err) { console.log(err); }
      });
    }
	};

}(this, this.document));