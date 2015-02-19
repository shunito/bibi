/*
 * BiB/i Plugin 
 * Bulk develop TTS
 */

Bibi.plugin.kanamoji = {
    name : "Kanamoji",
    discription: "kanamoji",
    author      : "Shunsuke Ito",
    version     : "0.0",
    Build       : "2015-02-19"
};

Bibi.plugin.kanamoji.init = function(){
    O.log(2, "plugin " + this.name + " loaded");

    var DIC_URL = "../plugin/kuromoji/dict/";
    var tokenizer = null;
    var wordList = [];

    // include Kuromoji.js
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = '../plugin/kuromoji/kuromoji.js';
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'kuromoji'));


    function addWord(word){
        if( typeof wordList[word] === 'undefined' ){ wordList[word] = 1; }
        else{ wordList[word] += 1; }
    }

    function tokenCount( token ){
        var i, l = token.length;
        var word = '', w, t , prev;
        console.table( token );

        prev = token[0];
        if( prev.pos === '名詞' ) { word = prev.surface_form; }

        for( i=1;i<l;i++){
            t = token[i]
            w = t.surface_form;
            if( t.pos === '名詞' ) {
                if( w  !== "、" ){
                    word += w;
                }
                else{
                    if( word.length > 0 ){
                        addWord(word);
                    }
                    word = '';                    
                }
            }
            else{
                if( word.length > 0 ){
                    addWord(word);
                }
                word = '';
            }
        }
        if( word.length > 0 ){
            addWord(word);
        }

        console.log( wordList );
    }

    function getPageBody(page){
        var item = R.Items[page];
        var doc = item.contentDocument || item.contentWindow.document;
        var body = doc.getElementsByTagName('body')[0];
        return body;
    }


    Bibi.plugin.bind("load", function(){
        kuromoji.builder({ dicPath: DIC_URL }).build(function (error, _tokenizer) {
            if (error != null) {
                console.log(error);
                return;
            }
            tokenizer = _tokenizer;

            // Kuromoji Ready!

            Bibi.plugin.addMenu(
              { id: "Kanamoji",
                label: "kuromoji do it",
                img: "../plugin/icon/ic_error_grey600_18dp.png" },
            function(){
                var token;
                var page = R.getCurrentPages();
                var body;

                wordList = [];                    
                pageNo = page.Start.Item.ItemIndex;
                body = getPageBody( pageNo );
                //console.log( body.innerText );

                token = tokenizer.tokenize(body.innerText);
                tokenCount( token );
                C.Panel.toggle();
            });
        });  
    });
}

// Init
Bibi.plugin.kanamoji.init();