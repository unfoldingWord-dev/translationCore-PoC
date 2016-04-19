(function (window, document) {

  checking = {
    current_index: 0,
    figure: {
      id: "empty",
      name: "empty",
      link: "empy"
    },
    notes: "empty",
    quote: "empty",
    reference: {
      book: "empty",
      chapter: 0,
      verse: 0
    },
    verses: {
      "empty": "empty"
    },
    update: function(figure_id, figure_vol, index){
      this.figure.id = figure_id;
      this.current_index = index;
      this.figure = this.figure_data[figure_id];
      this.figure["id"] = figure_id
      var notes = figures[figure_id][index];
      this.figure.link = this.figure_link(figure_id, figure_vol);
      this.notes = notes.notes;
      this.quote = notes.quote;
      this.reference = notes.reference;
      this.verses = this.verse_data(notes.reference);
      source = $("#check-template").html();
      template = Handlebars.compile( source );
      $("#check-placeholder").html( template( this ) );
      this.bind_copy();
      return false;
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
      var selText = "";
      $( document ).ready( function() {
        $( '#buttonCopy' ).mousedown( function() {
            $( '#quote' ).val( checking.getSelectedText() );
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

  Handlebars.registerHelper('figure_name', function(figure_id) {
    return checking.figure_data[figure_id.data.key].name;
  });

  var source = $("#menu-template").html();
  var template = Handlebars.compile( source );
  $("#menu-placeholder").html( template( figures ) ); 
  checking.update("metaphor", 1, 0);

}(this, this.document));