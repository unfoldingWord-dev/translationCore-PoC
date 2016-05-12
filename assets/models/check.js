(function (window, document) {

	checkModel = {
    gnt: [],
    verses: {
      source: {
        // name: "Bible Name",
        // text: "Verse text goes here."
      },
      target: {
        // name: "Bible Name",
        // text: "Verse text goes here."
      }
    },
    showPrev: false,
    showNext: true,
    source: {
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
    target: {
      // quote: "quote goes here",
      // retained: "retained"
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
      Handlebars.registerHelper('retained', function(block) {
        if (checkModel.target.retained == "retained"){
          return block.fn(this);
        }
      });
      Handlebars.registerHelper('replaced', function(block) {
        if (checkModel.target.retained == "replaced"){
          return block.fn(this);
        }
      });
      Handlebars.registerHelper('flagged', function(block) {
        if (checkModel.target.retained == "flagged"){
          return block.fn(this);
        }
      });
    },
    figure_link: function(type, vol){
      return "https://door43.org/_export/xhtmlbody/en/ta/vol"+this.source.meta.vol+"/translate/figs_"+this.source.meta.type;
    },
    getVerses: function(){
      var verses = {};
      var reference = this.source.reference;
      this.verses.source = {};
      $.each(referenceBibles, function(name, bible){
        var verse = bible[reference.book][reference.chapter][reference.verse];
        if (checkModel.verses.source.text === undefined){
          var quotes = checkModel.source.quote.split('...');
          // quotes.push(checkModel.source.quote);
          $.each(quotes, function(index, quote){
            verse = verse.replace(quote, '<strong>'+quote+'</strong>');
          });
          checkModel.verses.source = { name: name, text: verse }
        } else {
          checkModel.verses.target = { name: name, text: verse }
        }
      });
    },
    highlightTargetQuote: function(){
      // this.prepSaveData();
      var translation = this.verses.target.text;
      if (~translation.indexOf(this.target.quote)) {
        translation = translation.replace(this.target.quote, '<strong>'+this.target.quote+'</strong>');
        this.verses.target.text = translation;
      } else {
        console.log('saved translated quote not found.');
      }
    },
    getGNT: function(){
      var reference = this.source.reference;
      this.gnt = glade[reference.book][reference.chapter][reference.verse];
    },
    goToNext: function(){
      figureModel.load(this.source.type.id, (this.source.index + 1));
    },
    goToPrev: function(){
      figureModel.load(this.source.type.id, (this.source.index - 1));
    },
		load: function(data){
      this.source = data;
      if (this.source.index > 0) { this.showPrev = true; } else { this.showPrev = false; }
      this.onload();
		},
		onload: function(){
      if (this.source.index !== null) {
        this.getGNT();
        this.getVerses();
        this.loadData();
      }
		},
    reload: function(){
      this.load(this.source);
    },
    selectQuote: function(){
      var text = this.getSelectedText();
      if (text == "") {
        alert("No text is selected to copy into the textbox.")
      } else {
        // reset verse just in case it was already highlighted
        this.getVerses();
        // check to see if quote is in verse
        var translation = this.verses.target.text;
        if (~translation.indexOf(text)) {
          // save the quote and reload
          this.target.quote = text;
          this.highlightTargetQuote();
          this.save();
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
      var retained = $("input:radio[name='optionStatus']:checked").val();
      this.target.retained = retained;
      this.save();
    },
    prepSaveData: function(){
      var type = this.source.type.id;
      var book = this.source.reference.book;
      var chapter = this.source.reference.chapter.toString();
      var verse = this.source.reference.verse.toString();
      var quote = this.source.quote;
      if (this.saveData[type] === undefined){ this.saveData[type] = {} }
      if (this.saveData[type][book] === undefined){ this.saveData[type][book] = {} }
      if (this.saveData[type][book][chapter] === undefined){ this.saveData[type][book][chapter] = {} }
      if (this.saveData[type][book][chapter][verse] === undefined){ this.saveData[type][book][chapter][verse] = {} }
      if (this.saveData[type][book][chapter][verse][quote] === undefined){ this.saveData[type][book][chapter][verse][quote] = {} }
    },
    loadData: function(){
      // get data from AWS
      this.loadAWS(function(){
        checkModel.prepSaveData();
        checkModel.target = checkModel.saveData[checkModel.source.type.id][checkModel.source.reference.book][checkModel.source.reference.chapter.toString()][checkModel.source.reference.verse.toString()][checkModel.source.quote];
        checkModel.highlightTargetQuote();
        checkController.view(checkModel);
      });
    },
    save: function(){
      this.saveData[this.source.type.id][this.source.reference.book][this.source.reference.chapter.toString()][this.source.reference.verse.toString()][this.source.quote] = this.target;
      this.saveAWS();
    },
    saveAWS: function(){
      AWS.config.update({accessKeyId: applicationModel.aws_config.accessKeyId, secretAccessKey: applicationModel.aws_config.secretAccessKey});
      var bucket = new AWS.S3({params: {Bucket: applicationModel.aws_config.bucket}});
      var params = {Key: 'checkData.json', Body: JSON.stringify(this.saveData)};
      bucket.upload(params, function (err, data) {
        if (err) {
          console.log(err);
        } else {
          checkModel.reload();
        }
      });
    },
    loadAWS: function(callback){
      AWS.config.update({accessKeyId: applicationModel.aws_config.accessKeyId, secretAccessKey: applicationModel.aws_config.secretAccessKey});
      var bucket = new AWS.S3({params: {Bucket: applicationModel.aws_config.bucket}});
      bucket.getObject({Key: 'checkData.json'}).on('success', function(response) {
        checkModel.saveData = JSON.parse(response.data.Body.toString('utf-8'));
        callback();
      }).send();
    }
	};

  // translationcore/pt-br/Ephesians/metaphor/1.json

}(this, this.document));