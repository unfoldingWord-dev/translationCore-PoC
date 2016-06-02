$.ajaxSetup({
  crossOrigin: true,
  cache: true
});

function forObject(object, callback) {
  return Object.keys(object).map(function (key) {
    return callback(key, object[key]);
  });
}

// >>>>
// TargetResource
// >>>>
{
  var TargetResourceCategoryRow = React.createClass({
    render: function(){
      return (
        <tr>
          <th colspan="2">{this.props.language}</th>
        </tr>
      );
    }
  });

  var TargetResourceRow = React.createClass({
    getInitialState: function() {
      return {};
    },

    componentDidMount: function() {
      var _this = this;
      this.serverRequest = $.getJSON('http://cors.io/?u='+this.props.url, function(data){
        data.manifestUrl = _this.props.url;
        this.setState(data);
      }.bind(this));
    },

    componentWillUnmount: function() {
      this.serverRequest.abort();
    },

    handleClick: function(targetResourceConfig) {
      this.props.callback(targetResourceConfig);
    },

    render: function(){
      var row = <tr><td colspan="3"></td></tr>;
      if (this.state.manifestUrl !== undefined){
        var language = this.state.target_language.name;
        var project = this.state.project.name;
        row = <tr>
          <td>{language}</td>
          <td>{project}</td>
          <td onClick={this.handleClick.bind(this, this.state)}>Select</td>
        </tr>
      }
      return ( row );
    }
  });

  var TargetResourceTable = React.createClass({
      getInitialState: function() {
      return {
        manifests: []
      };
    },

    componentDidMount: function() {
      this.serverRequest = $.getJSON('/data/targetResourceManifests.json', function(data){
        this.setState({ manifests: data });
      }.bind(this));
    },

    componentWillUnmount: function() {
      this.serverRequest.abort();
    },

    render: function(){
      var rows = [];
      var callback = this.props.callback;
      this.state.manifests.forEach(function(url){
        rows.push(<TargetResourceRow url={url} callback={callback} key={url} />);
      });
      return (
        <table>
          <thead>
            <tr>
              <th>Language</th>
              <th>Project</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      );
    }
  });
}

// >>>>
// Menu
// >>>>
{
  var MenuCategoryRow = React.createClass({
    render: function(){
      return (
        <tr>
          <th>{this.props.typeName}</th>
        </tr>
      );
    }
  });

  var MenuRow = React.createClass({
    handleClick: function(checkingConfig) {
      this.props.callback(checkingConfig);
    },

    render: function(){
      return (
        <tr>
          <td onClick={this.handleClick.bind(this, this.props.checkingConfig)}>
            {this.props.checkingConfig.reference.book} {this.props.checkingConfig.reference.chapter}:{this.props.checkingConfig.reference.verse}
          </td>
        </tr>
      );
    }
  });

  var MenuTableSection = React.createClass({
    getInitialState: function() {
      return { figureNames: {} };
    },

    componentDidMount: function() {
      var url = '/data/figureNames.json';
      this.serverRequest = $.getJSON(url, function(data){
        this.setState( { figureNames: data });
      }.bind(this));      
    },

    render: function(){
      var rows = [];
      var _this = this
      var typeName = this.state.figureNames[this.props.typeId]
      this.props.figureArray.forEach(function(check){
        var checkingConfig = {
          typeId: _this.props.typeId,
          typeName: typeName,
          vol: check.vol,
          reference: check.reference,
          notes: check.notes,
          quote: check.quote
        };
        rows.push(<MenuRow callback={_this.props.callback} checkingConfig={checkingConfig} key={_this.props.typeId+check.reference.book+check.reference.chapter+check.reference.verse+check.quote} />);
      });
      return (
        <tbody>
          <MenuCategoryRow typeName={typeName} key={this.props.typeId} />
          {rows}
        </tbody>
      );
    }
  });

  var MenuTable = React.createClass({
    getInitialState: function() {
      return {
        book: '',
        data: {}
      };
    },

    componentDidMount: function() {
      if (this.state.book !== '') {
        var url = '/data/figures/'+this.props.book+'.json';
        this.serverRequest = $.getJSON(url, function(data){
          var newState = this.state;
          newState.data = data;
          this.setState(newState);
        }.bind(this));      
      }
    },

    componentWillUnmount: function() {
      this.serverRequest.abort();
    },

    changeBook: function(book) {
      if (this.state.book !== this.props.book) {
        var newState = this.state;
        newState.book = book;
        this.setState(newState);
        this.componentDidMount();
      }
    },

    render: function(){
      this.changeBook(this.props.book);
      var sections = [];
      var _this = this;
      forObject(this.state.data, function(typeId, checks){
        sections.push(<MenuTableSection callback={_this.props.callback} typeId={typeId} figureArray={checks} />);
      });
      return (
        <table>
          <thead>
            <tr>
              <th>Checks for {this.props.book}</th>
            </tr>
          </thead>
          {sections}
        </table>
      );
    }
  });
}

// >>>>
// Checking
// >>>>
{
  var LearningResource = React.createClass({
    render: function(){
      var url = 'https://door43.org/_export/xhtmlbody/en/ta/vol'+this.props.checkingConfig.vol+'/translate/figs_'+this.props.checkingConfig.typeId;
      return (
        <div>
          <h3>translationAcademy: {this.props.checkingConfig.typeName}</h3>
          <iframe src={url}></iframe>
        </div>
      );
    }
  });

  var GreekText = React.createClass({
    getInitialState: function() {
      return {};
    },

    componentDidMount: function() {
      var url = '/data/ugnt/'+this.props.reference.book+'.json';
      this.serverRequest = $.getJSON(url, function(data){
        this.setState(data);
      }.bind(this));
    },

    componentWillUnmount: function() {
      this.serverRequest.abort();
    },

    render: function(){
      var text = '';
      var reference = this.props.reference;
      if (this.state[reference.chapter] !== undefined){
        text = this.state[reference.chapter][reference.verse];
      }

      var html = {__html: text};
      return (
        <td dangerouslySetInnerHTML={html} />
      );
    }
  });

  var GatewayText = React.createClass({
    getInitialState: function() {
      return {};
    },

    componentDidMount: function() {
      var url = '/data/ulb/en/'+this.props.reference.book+'.json';
      this.serverRequest = $.getJSON(url, function(data){
        this.setState(data);
      }.bind(this));
    },

    componentWillUnmount: function() {
      this.serverRequest.abort();
    },

    render: function(){
      var text = '';
      var reference = this.props.reference;
      if (this.state[reference.book] !== undefined){
        text = this.state[reference.book][reference.chapter][reference.verse];
      }

      var quotes = this.props.quote.split('...');
      quotes.forEach(function(quote){
        text = text.replace(quote, '<strong>'+quote+'</strong>');
      });

      var html = {__html: text};
      return (
        <td dangerouslySetInnerHTML={html} />
      );
    }
  });

  var TargetText = React.createClass({
    getInitialState: function() {
      return {
        // '1': 'verse goes here'
      };
    },

    getChunk: function(){
      var targetResourceConfig = this.props.targetResourceConfig;
      var chapterString, chunkString;
      var reference = this.props.reference;
      targetResourceConfig.finished_chunks.forEach(function(string){
        var array = string.split('-');
        var _chapter = array[0];
        var _chunk = array[1];
        if (reference.chapter == parseInt(_chapter) && reference.verse >= parseInt(_chunk)) {
          chapterString = _chapter
          chunkString = _chunk
        }
      });
      var chunkFile = chapterString+'/'+chunkString+'.txt';
      var url = this.props.targetResourceConfig.manifestUrl.replace('manifest.json', chunkFile);
      var _this = this;
      this.serverRequest = $.get('http://cors.io/?u='+url, function(chunkString){
        var verses = _this.parseChunk(chunkString);
        _this.setState(verses);
      }.bind(this));
    },

    parseChunk: function(text){
      var verses = {}
      var versesTextArray = text.split(/\s*\\v /);
      versesTextArray.shift();
      versesTextArray.forEach(function(verseString){
        var match = /(\d+) (.*)\s*?/.exec(verseString);
        if (match !== null){
          verses[match[1]] = match[2];
        } else {
          console.log("couldn't parse verse data from chunk: "+verseString);
        }
      });
      return verses;
    },

    componentDidMount: function() {
      this.getChunk();
    },

    componentWillUnmount: function() {
      this.serverRequest.abort();
    },

    render: function(){
      var reference = this.props.reference;
      var html = {__html: this.state[reference.verse]};
      return (
        <td dangerouslySetInnerHTML={html} />
      );
    }
  });

  var TranslationNote = React.createClass({
    render: function(){
      var html = {__html: this.props.notes};
      return (
        <div>
          <h3>translationNote</h3>
          <p dangerouslySetInnerHTML={html} />
        </div>
      );
    }
  });

  var HighlightTarget = React.createClass({
    render: function(){
      return (
        <div>
          <h3>What is the translation of the quoted figure?</h3>
          <p>Highlight Selection</p>
        </div>
      );
    }
  });

  var VerseTable = React.createClass({
    render: function(){
      return (
        <table>
          <thead>
            <tr>
              <th>Greek New Testament</th>
              <th>Gateway Language</th>
              <th>Target Language</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <GreekText reference={this.props.reference} key="gnt" />
              <GatewayText quote={this.props.quote} reference={this.props.reference} key="gateway" />
              <TargetText targetResourceConfig={this.props.targetResourceConfig} reference={this.props.reference} key="target" />
            </tr>
          </tbody>
        </table>
      );
    }
  });

  var RetainedOption = React.createClass({
    render: function(){
      return (
        <label for="option-{this.props.option.id}" class="pure-radio">
          <input id="option-{this.props.option.id}" type="radio" name="optionStatus" value="{this.props.option.id}" />
          {this.props.option.label}
        </label>
      );
    }
  });

  var RetainedInput = React.createClass({
    render: function(){
      var _options = [
        {label: "Figure retained in translation", id: "retained"},
        {label: "Figure replaced in translation", id: "replaced"},
        {label: "Flagged for further review", id: "flagged"}
      ];
      var options = [];
      _options.forEach(function(option){
        options.push(<RetainedOption option={option} key={option.id} />);
      });
      return (
        <div>
          <h3>Was the figure retained, replaced or need to be flagged for further review?</h3>
          {options}
        </div>
      );
    }
  });

  var PaginationButton = React.createClass({
    render: function(){
      return (
        <div>
          {this.props.text}
        </div>
      );
    }
  });

  var Pagination = React.createClass({
    render: function(){
      var buttons = [];
      if (false) {
        buttons.push(<PaginationButton text="Prev" key='prev' />);
      };
      if (true) {
        buttons.push(<PaginationButton text="Next" key='next' />);
      };
      return (
        <div>
          {buttons}
        </div>
      );
    }
  });

  var CheckingForm = React.createClass({
    render: function(){
      var typeId = this.props.checkingConfig.typeId;
      var reference = this.props.checkingConfig.reference;
      return (
        <div>
          <h3>{this.props.checkingConfig.typeName}: {reference.book} {reference.chapter}:{reference.verse}</h3>
          <TranslationNote notes={this.props.checkingConfig.notes} />
          <HighlightTarget />
          <VerseTable targetResourceConfig={this.props.targetResourceConfig} quote={this.props.checkingConfig.quote} reference={this.props.checkingConfig.reference} />
          <RetainedInput />
          <Pagination />
        </div>
      );
    }
  });

  var Checking = React.createClass({
    render: function(){
      return (
        <div>
          <LearningResource checkingConfig={this.props.checkingConfig} />
          <CheckingForm targetResourceConfig={this.props.targetResourceConfig} checkingConfig={this.props.checkingConfig} />
        </div>
      );
    }
  });
}

// >>>>
// App
// >>>>
{
  var TargetResourceSection = React.createClass({
    render: function(){
      return (
        <div>
          <h2>Target Resources</h2>
          <TargetResourceTable targetResourceManifests={this.props.targetResourceManifests} callback={this.props.callback} />
        </div>
      );
    }
  });

  var MenuSection = React.createClass({
    render: function(){
      var menuSectionContent = <div id='menu'/>;
      if (this.props.project !== undefined){
        menuSectionContent = <div id='menu'>
          <h2>Menu for {this.props.project.name}</h2>
          <MenuTable callback={this.props.callback} book={this.props.project.name} />
        </div>
      }
      return (      
          menuSectionContent
      );
    }
  });

  var CheckingSection = React.createClass({
    render: function(){
      var checkingSectionContent = <div id='checking'/>;
      if (this.props.checkingConfig.typeId !== '') {
        checkingSectionContent = <div id='checking'>
          <h2>Checking</h2>
          <Checking targetResourceConfig={this.props.targetResourceConfig} checkingConfig={this.props.checkingConfig} />
        </div>
      }
      return (
        checkingSectionContent
      );
    }
  });

  var ApplicationHeader = React.createClass({
    render: function(){
      var subtitle = <p />
      if (this.props.targetResourceConfig.book !== '') {
        var subtitle = <p>{this.props.targetResourceConfig.project.name} - {this.props.targetResourceConfig.target_language.name}</p>
      }
      return (
        <div>
          <h1>translationCore</h1>
          {subtitle}
        </div>
      );
    }
  });

  var ApplicationWrapper = React.createClass({
    getInitialState: function(){
      return {
        targetResourceConfig: {
          url: '',
          book: '',
          language: ''//,
          //...
        },
        checkingConfig: {
          typeId: '',
          typeName: '',
          vol: '',
          reference: {},
          notes: '',
          quote: ''
        }
      };
    },

    onTargetResourceSelect: function(targetResourceConfig){
      var newState = this.state;
      newState.targetResourceConfig = targetResourceConfig;
      this.setState(newState).bind(this);
    },

    onCheckingReferenceSelect: function(checkingConfig){
      var newState = this.state;
      newState.checkingConfig = checkingConfig;
      this.setState(newState).bind(this);
    },

    render: function(){
      return (
        <div>
          <ApplicationHeader targetResourceConfig={this.state.targetResourceConfig} />
          <MenuSection project={this.state.targetResourceConfig.project} callback={this.onCheckingReferenceSelect} />
          <TargetResourceSection callback={this.onTargetResourceSelect} />
          <CheckingSection checkingConfig={this.state.checkingConfig} targetResourceConfig={this.state.targetResourceConfig} />
        </div>
      );
    }
  });
}

ReactDOM.render(
  <ApplicationWrapper />,
  document.getElementById('application')
);