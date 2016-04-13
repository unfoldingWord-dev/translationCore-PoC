class LitararyTags
  require "pry"
  require "json"

  attr :books, :devices, :file, :_book, :_chapter, :_verse, :tag_table

  def initialize(dir)
    @books = {}; @devices = {}
    @_file = ''; @_book = ''; @_chapter = 0; @_verse = 0
    @tag_table = {
      'APO' => 'apostrophe', 'CHI' => 'chiasmus', 'DOU' => 'doublet',
      'EUP' => 'euphemism', 'HEN' => 'hendiadys', 'HYP' => 'hyperbole',
      'IDM' => 'idiom', 'IDI' => 'idiom', 'IDO' => 'idiom', 'IRO' => 'irony',
      'LIT' => 'litotes', 'MET' => 'metaphor', 'MER' => 'metaphor', 'MTY' => 'metonymy',
      'PRS' => 'personification', 'RHQ' => 'rhetorical question', 'SIM' => 'simile',
      'SIL' => 'simile', 'SYM' => 'symbol', 'SAR' => 'sarcasm', 'SYN' => 'synecdoche',
      'TRI' => 'triple'
    }
    books_dir(dir)
  end

  def books_dir(dir)
    Dir.chdir(dir)
    Dir.glob('*.SFM').each do |file|
      @_file = file
      file_parse(file)
    end
  end

  def file_parse(file)
    File.open(file).each do |line|
      line_parse(line)
    end
    binding.pry if @_book.empty?
    @_book = ''; @_chapter = 0; @_verse = 0
  end

  def line_parse(line)
    if line[marker_regex=/^\\\w+/]
      case marker=line[marker_regex].gsub('\\','') rescue binding.pry
      when 'toc1'
        @_book = line.gsub('\toc1 ','').strip
      when 'mt1'
        @_book = line.gsub('\mt1 ','').strip if @_book.empty?
      when 'id'
        @_book = line.gsub('\id ','').strip if @_book.empty? 
      when 'c'
        @_chapter = line[/\d+/].to_i
      when 'v'
        verse_regex = /\\v \d+/
        @_verse = line[verse_regex].gsub('\v ','').strip.to_i if line[verse_regex]
      else
        nil
      end

      literary_tags(line) if _verse > 0
    end
  end

  def literary_tags(line)
    tag_regex = /\[\w+\]/
    if line[tag_regex]
      line.scan(tag_regex).each do |item|
        tag = item[/\w+/]
        unless tag == 'Or'
          books[_book] ||= {}
          books[_book][_chapter] ||= {}
          books[_book][_chapter][_verse] ||= []
          tag_name = tag_table.key?(tag) ? tag_table[tag] : tag
          books[_book][_chapter][_verse] << tag_name

          devices[tag_name] ||= {}
          devices[tag_name][_book] ||= {}
          devices[tag_name][_book][_chapter] ||= []
          devices[tag_name][_book][_chapter] << _verse
        end
      end
    end
  end

  def json_by_book(book='all')
    if book == 'all'
      response = books
    else
      response = books[book]
    end
    JSON.pretty_generate(response)
  end

  def json_by_device
    JSON.pretty_generate(devices)
  end

  def html_by_book
    html = <<-HTML
#{html_head}
    <body>
    <h1>Literary Devices</h1>
    <p>From the Translation for Translators, Extracted by Book, Chapter, Verse</p>
    <div id='accordion'>
    HTML
    books.each do |book_name, book_data|
      html << "\t<h3>#{book_name}</h3>\n"
      html << "\t<div>\n"
      book_data.each do |chapter_number, chapter_data|
        html << "\t<h5>Chapter #{chapter_number}</h5>\n"
        chapter_data.each do |verse, tags|
          html << "\t<p>#{verse}: #{tags.join(', ')}</p>\n"
        end
      end
      html << "\t</div>\n"
    end
    html << <<-HTML
    </div>
  </body>
</html>
    HTML
  end

  def html_by_device
    html = <<-HTML
#{html_head}
  <body>
  <h1>Literary Devices</h1>
  <p>From the Translation for Translators, Extracted by Litarary Device and reference</p>
  <div id='accordion'>
    HTML
    devices.each do |tag_name, tag_data|
      times = 0
      tag_data.each{|book_name,book_data| book_data.each{|chapter, verses| times += verses.count } }
      html << "\t<h3>#{tag_name}: #{times} occurrences</h3>\n"
      html << "\t<div>\n"
      tag_data.each do |book_name, book_data|
        html << "\t<h5>#{book_name.empty? ? 'Error in getting name of Book' : book_name}</h5>\n"
        html << "\t<p>"
        book_data.each do |chapter, verses|
          html << "#{chapter}:#{verses.join(',')}; "
        end
        html << "</p>\n"
      end
      html << "\t</div>\n"
    end
    html << <<-HTML
    </div>
  </body>
</html>
    HTML
  end

  def html_head
<<-HTML
<html>
  <head>
    <link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
    <script src="//code.jquery.com/jquery-1.10.2.js"></script>
    <script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
    <script>
        $(function() {
          $( "#accordion" ).accordion({ collapsible: true });
        });
    </script>
  </head>
HTML
  end

end

literary_tags = LitararyTags.new('../sources/translation-for-translators')
puts literary_tags.json_by_book

