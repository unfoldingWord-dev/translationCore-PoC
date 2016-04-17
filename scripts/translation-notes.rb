class TranslationNotes
  require "pry"
  require "awesome_print"
  require "json"

  attr :figures, :ulb, :book, :chapter, :chunk, :_verse, :verse, :section

  def initialize(dir)
    @figures = {}
    @ulb = {}
    @book = ''
    @chapter = 0
    @chunk = 0
    @_verse = 0
    @verse = 0
    @section = ''
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
    File.open(input, "r:UTF-8").each do |line|
      line_parse(line)
    end
    @_verse = 0
    @verse = 0
    @section = ''
  end

  def line_parse(line)
    section_parse(line)
    ulb_parse(line) if @section == 'ULB'
    notes_parse(line) if @section == 'Translation Notes'
  end

  def ulb_parse(line)
    return unless line[/\\\w \d*/]
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
    @section = line.scan(section_regex).first.first if line[section_regex]
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
    ulb.each do |_book, chapters|
      chapters.each do |_chapter, verses|
        verses.each do |_verse, text|
          @verse = _verse if text.gsub(/\s+/,' ')[/#{quote.strip.gsub(/\s+/,' ')}/]
        end
      end
    end
    verse
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
    notes_regex = /(#{quote_regex}\s+-\s+.*)\s*\(\w+/

    notes[:quote] = line.scan(quote_regex).first.first.strip
    notes[:notes] = wiki_to_html(line.scan(notes_regex).first.first.strip).strip

    types.each_with_index do |type, index|
      notes[:vol] = vols[index]
      notes[:quote].split('...').each do |_quote|
        verse_lookup(_quote)
        binding.pry if verse == 0
        raise "no verse found for quote '#{notes[:quote]}' in #{notes[:reference]}" unless verse > 0
        notes[:reference] = {book: book, chapter: chapter, verse: verse}
      
        figures[type] ||= []
        figures[type] << notes
      end
    end
  end

  def wiki_to_html(string)
    #input: **the head over all things in the Church**  - "Head" implies the leader or the one in charge. AT: "ruler over all things in the Church"
    #output: <strong>the head over all things in the Church</strong>  - "Head" implies the leader or the one in charge. AT: "ruler over all things in the Church"
    string.gsub(/^\s*\*\*/, "<strong>").gsub(/\*\*\s*-/, "</strong> -")
  end

  def figures_json
    JSON.pretty_generate(figures)
  end

  def ulb_json
    JSON.pretty_generate(ulb)
  end
end

tn = TranslationNotes.new('../sources/notes')
puts tn.figures_json
# puts tn.notes_parse(%q{* **the head over all things in the Church**  - "Head" implies the leader or the one in charge. AT: "ruler over all things in the Church"(See: [[en:ta:vol1:translate:figs_metaphor]]) })
# puts tn.section_parse('===== Translation Notes: =====')
