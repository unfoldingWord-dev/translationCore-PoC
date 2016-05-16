(function (window, document) {

  targetModel = {
    // data for default/top part of menu
    config: {
      // manifest: "https://git.door43.org/tanem/ceb_luk_text_reg/raw/master/manifest.json",
      manifest: "https://git.door43.org/klappy/ilo_luk_text_ulb/raw/master/manifest.json"
    },
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
    parseManifest: function(url){
      $.ajaxSetup({
        crossOrigin: true,
        cache: false
      });
      getURL(this.config.manifest, function(response){
        targetModel.manifest = JSON.parse(response);
        targetModel.onload();
      });
    },
    getVerse: function(){
      this.getCurrentChunk();
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
    getCurrentChunk: function(){
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
      figureModel.onTargetModelLoad();
    },
    load: function(){
      this.currentReference = {chapter: figureModel.data.reference.chapter, verse: figureModel.data.reference.verse};
      this.parseManifest(this.config.manifest);
    },
    onload: function(){
      this.getVerse();      
    }
  };

}(this, this.document));