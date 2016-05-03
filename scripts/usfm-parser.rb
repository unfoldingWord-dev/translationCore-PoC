class UsfmParser
  require "pry"
  require "awesome_print"
  require "json"

  attr :language, :bible, :book, :chapter, :chunk, :verse

  def initialize(dir)
    @language = ''
    @bible = {}
    @book = ''
    @chapter = 0
    @chunk = 0
    @verse = 0
    @start_path = Dir.pwd
    bibles_dir(dir)
  end

  def bibles_dir(dir)
    Dir.chdir(dir)
    _path = Dir.pwd
    Dir.glob('*').select{|f| File.directory? f}.each do |language|
      @language = language
      Dir.chdir(_path)
      bible_dir(language)
      write_files
      @bible = {}
      @book = ''
      @chapter = 0
      @chunk = 0
      @verse = 0
    end
  end

  def bible_dir(dir)
    Dir.chdir(dir)
    Dir.glob('*.usfm').each do |file|
      book_ids = %w(nil Mat Mar Luk Joh Act Rom 1Co 2Co Gal Eph Phi Col 1Th 2Th 1Ti 2Ti Tit Phm Heb Jam 1Pe 2Pe 1Jo 2Jo 3Jo Jud Rev).map(&:upcase)
      book_names = %w(nil Matthew Mark Luke John Acts Romans 1Corinthians 2Corinthians Galatians Ephesians Philippians Colossians 1Thessalonians 2Thessalonians 1Timothy 2Timothy Titus Philemon Hebrews James 1Peter 2Peter 1John 2John 3John Jude Revelation)
      @book = book_names[book_ids.index(file[/[A-Z]+/])]
      file_parse(file)
    end
  end

  def file_parse(input)
    File.open(input, "r:UTF-8").each do |line|
      line_parse(line)
    end
    @chapter = 0
    @verse = 0
  end

  def line_parse(line)
    return unless line[/^\\\w\s+\d*/]
    case marker=line[/^\\\w+/].gsub('\\','') rescue line
    when 'id', 'ide', 'h', 'toc1', 'toc2', 'toc3', 'mt1', 'mt2'
      marker #do nothing, since we got the titles from the filename
    when 'c'
      @chapter = line[/^\\\w\s+\d+/][/\d+/].to_i
      @verse = 0
    when 'v'
      @verse = line[/^\\\w\s+\d+/][/\d+/].to_i
      bible_verse_add(line.gsub(/^\\\w\s+\d+/,''))
    else
      bible_verse_add(line.gsub(/^\\\w\s+\d*/,''))
    end
  end

  def bible_verse_add(_string, string=_string.strip)
    @bible[book] ||= {}
    @bible[book][chapter] ||= {}
    verse_text = @bible[book][chapter][verse]
    verse_text = verse_text ? verse_text + ' ' + string : string
    @bible[book][chapter][verse] = verse_text.gsub(/\s+/, ' ')
  end

  def write_files
    _path = Dir.pwd
    Dir.chdir(@start_path)
    json = JSON.pretty_generate(bible)
    File.open("../data/ulb/#{language}.json", 'w') do |file|
      file.puts(json)
    end
    File.open("../data/ulb/#{language}.js","w") do |file|
      js = "reference_bibles['Unlocked Literal Bible - #{language}'] = #{json};"
      file.puts(js)
    end
    Dir.chdir(_path)
  end
end

bible = UsfmParser.new('../sources/ulb/')

