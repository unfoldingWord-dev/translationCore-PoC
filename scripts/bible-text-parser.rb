class GNTParser
  require 'json'
  require 'pry'
  require 'unicode_utils'

  attr :bible, :training_data, :book_names, :path
  def initialize(params={path: '../sources/ugnt/wht-westcott-hort_eph.txt'})
    @bible = {}
    @training_data = []
    @book_names = %w(nil Matthew Mark Luke John Acts Romans 1Corinthians 2Corinthians Galatians Ephesians Philippians Colossians 1Thessalonians 2Thessalonians 1Timothy 2Timothy Titus Philemon Hebrews James 1Peter 2Peter 1John 2John 3John Jude Revelation)
    @path = params[:path]
    bible_parse
  end

  def bible_parse
    File.open(path, "r:UTF-8").each do |line|
      reference_regex = /^\w+\s\d+:\d+/
      reference = bible_reference(line[reference_regex])
      verse = UnicodeUtils.nfkc(line.force_encoding('UTF-8')).gsub(reference_regex, '').strip
      
      add_verse(reference, verse)
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

  def add_verse(reference, verse, _book=reference[:book], _chapter=reference[:chapter], _verse=reference[:verse])
      bible_build(reference)
      @bible[_book][_chapter][_verse] = verse 
  end

  def bible_build(reference)
    @bible[reference[:book]] ||= {}
    @bible[reference[:book]][reference[:chapter]] ||= {}
    @bible[reference[:book]][reference[:chapter]][reference[:verse]] ||= {}
  end

  def json
    JSON.pretty_generate(bible)
  end

end

gnt = GNTParser.new()
puts gnt.json