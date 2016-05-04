class TranslationNotes
  require "pry"
  require "awesome_print"
  require "json"

  attr :figures, :words, :ulb, :errors, :book, :chapter, :chunk, :_verse, :verse, :section

  def initialize(dir)
    @figures = {}
    @words = {}
    @ulb = {}
    @errors = []
    @book = ''
    @chapter = 0
    @chunk = 0
    @_verse = 0
    @verse = 0
    @section = ''
    @start_path = Dir.pwd
    books_dir(dir)
  end

  def books_dir(dir)
    Dir.chdir(dir)
    Dir.glob('*').select{|f| File.directory? f}.each do |subdir|
      book_ids = %w(nil Mat Mar Luk Joh Act Rom 1Co 2Co Gal Eph Phi Col 1Th 2Th 1Ti 2Ti Tit Phm Heb Jam 1Pe 2Pe 1Jo 2Jo 3Jo Jud Rev).map(&:downcase)
      book_names = %w(nil Matthew Mark Luke John Acts Romans 1Corinthians 2Corinthians Galatians Ephesians Philippians Colossians 1Thessalonians 2Thessalonians 1Timothy 2Timothy Titus Philemon Hebrews James 1Peter 2Peter 1John 2John 3John Jude Revelation)
      @book = book_names[book_ids.index(subdir)]

      Dir.chdir(subdir)
      chapters_dir
      Dir.chdir('..')
    end
  end

  def chapters_dir
    Dir.glob('*').select{|f| File.directory?(f) && f.to_i > 0}.each do |subdir|
      @chapter = subdir.to_i
      Dir.chdir(subdir)
      chunk_files
      Dir.chdir('..')
    end
  end

  def chunk_files
    Dir.glob('[0-9][0-9].txt') do |file|
      @chunk = file.to_i
      file_parse(file)
    end
  end

  def file_parse(input)
    File.open(input, "r:UTF-8").each do |_line, line=_line.force_encoding('UTF-8')|
      line_parse(line)
    end
    @_verse = 0
    @verse = 0
    @section = ''
  end

  def line_parse(line)
    _error = nil
    line[/.*/] rescue _error = error("invalid, non utf-8 characters", line.encode('ASCII', invalid: :replace, undef: :replace))
    if _error
      return
    end
    section_parse(line)
    ulb_parse(line) if @section == 'ULB'
    notes_parse(line) if @section == 'Translation Notes'
    words_parse(line) if @section == 'translationWords'
  end

  def ulb_parse(line)
    return unless line[/\\\w\s*\d*/] || verse > 0
    if verse_number(line) > 0
      ulb[book] ||= {}
      ulb[book][chapter] ||= {}
      _line = line.gsub(/\\\w \d*/,'').strip
      ulb[book][chapter][_verse] ||= ""
      ulb[book][chapter][_verse] << ' '+_line.gsub(/\s+/,' ')
      ulb[book][chapter][_verse].gsub(/^\s/,'')
    end
  end

  def section_parse(line)
    section_regex = /=+\s(.+?):\s=+/
    @section = line.scan(section_regex).first.first if line[section_regex] rescue binding.pry
  end

  def verse_number(line)
    verse_regex = /\\v \d+/
    if line[verse_regex]
      @_verse = line[verse_regex].gsub('\v ','').to_i
    end
    _verse
  end

  def verse_lookup(quote)
    @verse = 0
    raise "no ULB verses found" unless @ulb
    #TODO: may accidentally be looking in all of @ulb and not just the verses in this file.
    ulb[book][chapter].each do |_verse, text|
      @verse = _verse if text.gsub(/\s+/,' ')[/#{Regexp.escape(quote.strip.gsub(/\s+/,' '))}/i]
    end
    verse
  end

  def words_parse(line)
    return unless line[/\[\[.*\]\]/]

    type_regex = /\[\[.*\:obe\:(\w+)\:\w+(\|.+)?\]\]/
    type = line.scan(type_regex).first ? line.scan(type_regex).first.first : nil
    if type == nil
      error("malformed translationWord link", line)
      return
    end

    word_regex = /\[\[.*\:obe\:\w+\:(\w+)(\|.+)?\]\]/
    word = line.scan(word_regex).first.first

    words[type] ||= {}
    words[type][word] ||= []
    words[type][word] << {book: book, chapter: chapter, chunk: chunk}
  end

  def notes_parse(line)
    figs_regex = /:figs_/
    return unless line[figs_regex]
    # raise "more than one figure in #{book} #{chapter}:#{verse} chunk:#{chunk} #{section} \n#{line}" if line.scan(figs_regex).count > 1

    notes = {quote: nil, notes: nil}
    
    types_regex = /\[\[.+figs_(\w+)\|?.*?\]\]/
    types = line.scan(types_regex).map(&:first)
    vols_regex = /\[\[.+vol(\w+).*\|?.*?\]\]/
    vols = line.scan(vols_regex).map(&:first)

    quote_regex = /\*\*(.+)\*\*/
    notes_regex = /(#{quote_regex}\s*-?\s+.*)\s*\(\[*\w+/

    notes[:quote] = line.scan(quote_regex).first ? line.scan(quote_regex).first.first.strip : nil
    unless notes[:quote]
      error("no quote found", line)
      return  
    end

    notes[:notes] = wiki_to_html(line.scan(notes_regex).first.first.strip).strip rescue binding.pry
    unless notes[:notes]
      error("no note found", line)
      return  
    end

    types.each_with_index do |type, index|
      notes[:vol] = vols[index]
      notes[:quote].gsub('…', '...').split('...').each do |_quote|
        verse_lookup(_quote) rescue binding.pry

        notes[:reference] = {book: book, chapter: chapter, chunk: chunk, verse: verse}

        if verse == 0
          error("no verse found for quote", line)
          return
        else      
          figures[type] ||= []
          figures[type] << notes
        end
      end
    end
  end

  def wiki_to_html(string)
    #input: **the head over all things in the Church**  - "Head" implies the leader or the one in charge. AT: "ruler over all things in the Church"
    #output: <strong>the head over all things in the Church</strong>  - "Head" implies the leader or the one in charge. AT: "ruler over all things in the Church"
    string.gsub(/^\s*\*\*/, "<strong>").gsub(/\*\*\s*-/, "</strong> -")
  end

  def error(message, line, reference={book: book, chapter: chapter, chunk: chunk, verse: verse})
    _error = {
      message: message,
      line: line,
      reference: reference
    }
    errors << _error
    _error
  end

  def write_files
    # create files by type
    Dir.chdir(@start_path)
    %w{figures words errors}.each do |type|
      json = JSON.pretty_generate(self.send(type))
      File.open("../data/#{type}.json","w") do |f|
        f.puts(json)
      end
      File.open("../data/#{type}.js","w") do |f|
        js = "var #{type} = #{json};"
        f.puts(js)
      end
    end
    ulb_json = JSON.pretty_generate(ulb)
    File.open("../data/ulb/en.json","w") do |f|
      f.puts(ulb_json)
    end
    File.open("../data/ulb/en.js","w") do |f|
      ulb_js = "reference_bibles['Unlocked Literal Bible - en'] = #{ulb_json};"
      f.puts(ulb_js)
    end
  end

end

tn = TranslationNotes.new('../sources/notes')
puts tn.write_files
# puts tn.notes_parse(%q{* **the head over all things in the Church**  - "Head" implies the leader or the one in charge. AT: "ruler over all things in the Church"(See: [[en:ta:vol1:translate:figs_metaphor]]) })
# puts tn.section_parse('===== Translation Notes: =====')
