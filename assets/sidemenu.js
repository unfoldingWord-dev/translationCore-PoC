(function (window, document) {

    $.each(figures, function(figure, books){        
        $('#menu div').append('<a class="pure-menu-heading" href="#">'+figure+'</a>');
        var references = '<ul class="pure-menu-list">';
        $.each(books, function(book, chapters){
            $.each(chapters, function(chapter, verses){
                $.each(verses, function(verse, note){
                    references = references +
                    '<li class="pure-menu-item"><a class="pure-menu-link">'+
                    book+' '+chapter+':'+verse+
                    '</a></li>';
                    console.log('run');
                });
            });
        });
        references = references + '</ul>';
        $('#menu div').append(references);
        figure_html = '';
        references = '';
    });

}(this, this.document));

(function (window, document) {

    var layout   = document.getElementById('layout'),
        menu     = document.getElementById('menu'),
        menuLink = document.getElementById('menuLink');

    function toggleClass(element, className) {
        var classes = element.className.split(/\s+/),
            length = classes.length,
            i = 0;

        for(; i < length; i++) {
          if (classes[i] === className) {
            classes.splice(i, 1);
            break;
          }
        }
        // The className is not found
        if (length === classes.length) {
            classes.push(className);
        }

        element.className = classes.join(' ');
    }

    menuLink.onclick = function (e) {
        var active = 'active';

        e.preventDefault();
        toggleClass(layout, active);
        toggleClass(menu, active);
        toggleClass(menuLink, active);
    };

}(this, this.document));