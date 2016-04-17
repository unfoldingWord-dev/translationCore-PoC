(function (window, document) {

  checking = {
    current_index: 0,
    figure: {
      id: "empty",
      name: "empty",
      ta_link: "empty"
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
    update: function(figure_id, index){
      this.figure.id = figure_id;
      this.current_index = index;
      this.figure = this.figure_data[figure_id];
      this.figure["id"] = figure_id
      var notes = figures[figure_id][index];
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
    figure_data: {
      "metaphor": {
        name: "Metaphor",
        ta_link: "./sources/translationAcademy/figs_metaphor.html"
      },
      "you": {
        name: "You",
        ta_link: "/sources/translationAcademy/figs_you.html"
      },
      "activepassive": {
        name: "Active Passive",
        ta_link: "/sources/translationAcademy/figs_activepassive.html"
      },
      "inclusive": {
        name: "Inclusive",
        ta_link: "/sources/translationAcademy/figs_inclusive.html"
      },
      "doublet": {
        name: "Doublet",
        ta_link: "/sources/translationAcademy/figs_doublet.html"
      },
      "exclusive": {
        name: "Exclusive",
        ta_link: "/sources/translationAcademy/figs_exclusive.html"
      },
      "doublenegatives": {
        name: "Double Negatives",
        ta_link: "/sources/translationAcademy/figs_doublenegatives.html"
      },
      "idiom": {
        name: "Idiom",
        ta_link: "/sources/translationAcademy/figs_idiom.html"
      },
      "metonymy": {
        name: "Metonymy",
        ta_link: "/sources/translationAcademy/figs_metonymy.html"
      },
      "explicit": {
        name: "Explicit",
        ta_link: "/sources/translationAcademy/figs_explicit.html"
      },
      "youdual": {
        name: "You Dual",
        ta_link: "/sources/translationAcademy/figs_youdual.html"
      },
      "parallelism": {
        name: "parallelism",
        ta_link: "/sources/translationAcademy/figs_parallelism.html"
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

}(this, this.document));