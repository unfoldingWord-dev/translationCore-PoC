class BibleTextParser
  require 'json'
  require 'pry'
  require 'unicode_utils'

  attr :bible, :training_data, :book_names
  def initialize
    @bible = {}
    @training_data = []
    @book_names = %w(nil Matthew Mark Luke John Acts Romans 1Corinthians 2Corinthians Galatians Ephesians Philippians Colossians 1Thessalonians 2Thessalonians 1Timothy 2Timothy Titus Philemon Hebrews James 1Peter 2Peter 1John 2John 3John Jude Revelation)
    bible_parse
  end

  def bible_parse(path='../sources/wht-westcott-hort.txt')
    File.open(path, "r:UTF-8").each do |line|
      reference_regex = /^\w+\s\d+:\d+/
      reference = bible_reference(line[reference_regex])
      verse = UnicodeUtils.nfkc(line.force_encoding('UTF-8')).gsub(reference_regex, '').strip
      
      words = verse.split(/\b/).delete_if { |word| word[/^\s$/] }
      training_data_build(words)
      words.each do |word|
        add_word(reference, word, :wht)
      end
    end
  end

  def bible_reference(_ref, ref=_ref.dup) # reference("Matt 13:55") #=> {book: "Matt", chapter: 13, verse: 55}
    book_ids = %w(nil Mat Mar Luk Joh Act Rom 1Co 2Co Gal Eph Phi Col 1Th 2Th 1Ti 2Ti Tit Phm Heb Jam 1Pe 2Pe 1Jo 2Jo 3Jo Jud Rev)
    book = book_names[book_ids.index(ref.gsub(/\s+\d+:\d+$/,'').strip)]
    {
      book: book,
      chapter: ref[/\d+:\d+$/].gsub(/:\d+/,'').strip.to_i,
      verse: ref[/\d+:\d+$/].gsub(/\d+:/,'').strip.to_i
    }
  end

  def add_word(reference, word, source, _book=reference[:book], _chapter=reference[:chapter], _verse=reference[:verse])
      bible_build(reference)
      @bible[_book][_chapter][_verse][source] ||= []
      @bible[_book][_chapter][_verse][source]<< word
  end

  def bible_build(reference)
    @bible[reference[:book]] ||= {}
    @bible[reference[:book]][reference[:chapter]] ||= {}
    @bible[reference[:book]][reference[:chapter]][reference[:verse]] ||= {}
  end

  def training_data_build(words)
    hash = {}
    words.each {|word| hash[word] = 1 }
    @training_data << {input: hash, output: hash}
  end
end

bible = BibleTextParser.new()
puts JSON.pretty_generate(bible.training_data)