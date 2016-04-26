(function (window, document) {

  data = {};

  localforage.getItem("data", function(err, value){
    if (err) {
      console.log(err);
    } else {
      if (value !== null) {
        data = value;
        checking.reload();
      }
    }
  });

  checking = {
    current_index: 0,
    figure: {
      id: "empty",
      vol: 0,
      name: "empty",
      link: "empy"
    },
    prev: false,
    next: true,
    notes: "empty",
    quote: "empty",
    reference: {
      book: "empty",
      chapter: 0,
      verse: 0
    },
    gnt_glade_words: [],
    verses: {
      "empty": "empty"
    },
    render: function(figure_id, figure_vol, index){
      if (index > 0) { this.prev = true; } else { this.prev = false; }
      this.current_index = index;
      this.figure = this.figure_data[figure_id];
      this.figure.id = figure_id;
      this.figure.vol = figure_vol;
      var notes = figures[figure_id][index];
      this.figure.link = this.figure_link(figure_id, figure_vol);
      this.notes = notes.notes;
      this.quote = notes.quote;
      this.reference = notes.reference;
      this.verses = this.verse_data(this.reference);
      this.gnt_glade_words = this.gnt_glade_get_verse(this.reference);
      source = $("#check-template").html();
      template = Handlebars.compile( source );
      $("#check-placeholder").html( template( this ) );
      this.bind_copy();
      this.load();
      return false;
    },
    save: function(){
      var quote = $('input#quote').val();
      var versions = Object.keys(checking.verses);
      var translated_version = versions[versions.length-1];
      var translation = checking.verses[translated_version];
      if (~translation.indexOf(quote)) {} else {
        alert("The quote must come from the target translation.");
        return false;
      }
      var retained = $("input:radio[name='optionStatus']:checked").val();
      if (quote == "" || retained == undefined) {
        alert("You must provide both details.");
        return false;
      } else {
        if (data[this.figure.name]){}
        else {
          data[this.figure.name] = [];
        }
        data[this.figure.name][this.current_index] = {
          quote: quote, 
          retained: retained, 
          reference: this.reference
        };
        localforage.setItem("data", data, function (err) {
          if (err) { console.log(err); }
        });
        return true;
      }
    },
    load: function(){
      if (data[this.figure.name] && data[this.figure.name][this.current_index]) {
        $('input#quote').val(data[this.figure.name][this.current_index].quote);
        $("input:radio[name='optionStatus'][value=" + data[this.figure.name][this.current_index].retained + "]").prop('checked', true);
      }
    },
    reload: function(){
      checking.render(checking.figure.id, checking.figure.vol, (checking.current_index));
    },
    goToNext: function(){
      if (checking.save()) {
        checking.render(checking.figure.id, checking.figure.vol, (checking.current_index + 1));
      }
    },
    goToPrev: function(){
      if (checking.save()) {
        checking.render(checking.figure.id, checking.figure.vol, (checking.current_index - 1));
      }
    },
    gnt_glade_get_verse: function(reference){
      return glade[reference.book][reference.chapter][reference.verse];
    },
    verse_data: function(reference){
      var verses = {};
      $.each(reference_bibles, function(name, bible){
        var quotes = checking.quote.split('...');
        var verse = bible[reference.book][reference.chapter][reference.verse];
        $.each(quotes, function(index, quote){
          verse = verse.replace(quote, '<strong>'+quote+'</strong>');
        });
        verses[name] = verse;
      });
      return verses;
    },
    figure_link: function(type, vol){
      return "https://door43.org/_export/xhtmlbody/en/ta/vol"+vol+"/translate/figs_"+type
    },
    figure_data: {
      "metaphor": {
        name: "Metaphor"
      },
      "you": {
        name: "You"
      },
      "activepassive": {
        name: "Active Passive"
      },
      "inclusive": {
        name: "Inclusive"
      },
      "doublet": {
        name: "Doublet"
      },
      "exclusive": {
        name: "Exclusive"
      },
      "doublenegatives": {
        name: "Double Negatives"
      },
      "idiom": {
        name: "Idiom"
      },
      "metonymy": {
        name: "Metonymy"
      },
      "explicit": {
        name: "Explicit"
      },
      "youdual": {
        name: "You Dual"
      },
      "parallelism": {
        name: "parallelism"
      }
    },
    bind_copy: function(){
      $( document ).ready( function() {
        $( '#buttonCopy' ).mousedown( function() {
            var text = checking.getSelectedText();
            if (text == "") {
              alert("No text is selected to copy into the textbox.")
            }
            $( '#quote' ).val( text );
        });
        return false;
      });
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
    }
  };

  Handlebars.registerHelper('figure_name', function(object) {
    return checking.figure_data[object.data.key].name;
  });

  Handlebars.registerHelper('next_id', function(current_index) {
    return checking.current_index + 1;
  });

  Handlebars.registerHelper('prev_id', function(object) {
    return checking.current_index - 1;
  });

  var source = $("#menu-template").html();
  var template = Handlebars.compile( source );
  $("#menu-placeholder").html( template( figures ) ); 

  if (checking.figure.id == "empty") {
    console.log("Initial load.");
    checking.render("metaphor", 1, 0);
  }

}(this, this.document));