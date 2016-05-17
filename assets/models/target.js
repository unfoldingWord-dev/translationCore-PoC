(function (window, document) {

  targetModel = {
    // data for default/top part of menu
    manifest: {
      // target_langauge: {
      //   id: "asd",
      //   name: "Asdf",
      //   direction: "ltr"
      // },
      // "resource": {
      //   "id": "reg",
      //   "name": "Regular"
      // },
      // project: {
      //   id: "luk",
      //   name: "Luke"
      // },
      // finished_chunks: [
      //   "00-title",
      //   "01-01",
      //   "01-05"
      // ]
    },
    verses: {
      // 1: {
      //   1: "verse",
      //   5: "verse"
      // }
    },
    parseManifest: function(url, callback){
      $.ajaxSetup({
        crossOrigin: true,
        cache: false
      });
      getURL(url, function(manifest){
        callback(JSON.parse(manifest));
      });
    },
    parseCurrentChunk: function(){
      $.each(this.manifest.finished_chunks, function(index, string){
        var array = string.split('-');
        var _chapter = array[0];
        var _chunk = array[1];

        if (targetModel.currentReference.chapter == parseInt(_chapter) && targetModel.currentReference.verse >= parseInt(_chunk)) {
          targetModel.currentReference.chapterString = _chapter
          targetModel.currentReference.chunkString = _chunk
        }
      });
    },
    getVerse: function(){
      this.parseCurrentChunk();
      var chunkFile = targetModel.currentReference.chapterString+'/'+targetModel.currentReference.chunkString+'.txt';
      var url = targetModel.config.manifest.replace('manifest.json', chunkFile);
      getURL(url, function(response){
        targetModel.parseChunk(response);
      });
    },
    parseChunk(chunkString){
      if (this.verses[this.currentReference.chapter] === undefined) {
        this.verses[this.currentReference.chapter] = {};
      }
      var verses = chunkString.split(/\s*\\v /);
      verses.shift();
      $.each(verses, function(index, verseString){
        match = /(\d+) (.*)\s*?/.exec(verseString);
        if (match !== null){
          var verse = match[1]
          var verseString = match[2]
          targetModel.verses[targetModel.currentReference.chapter][verse] = verseString;
          targetModel.onVerseLoad();
        } else {
          console.log("couldn't parse verse data from chunk: "+targetModel.currentReference.chapterString+":"+targetModel.currentReference.chunkString, verseString);
        }
      });
    },
    onVerseLoad: function(){
      checkModel.load(figureModel.data);
    },
    load: function(manifest){
      this.manifest = manifest;
      this.verses = {};
      figureController.collection(manifest.project.name, function(){
        figureModel.currentFigureGet(function(){
          targetModel.currentReference = {chapter: figureModel.data.reference.chapter, verse: figureModel.data.reference.verse};  
          targetModel.onload();
        });
      });
    },
    onload: function(){
      this.getVerse();
    }
  };

}(this, this.document));