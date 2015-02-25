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
    var wordCounter = [];

    // include Kuromoji.js
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = '../plugin/kuromoji/kuromoji.js';
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'kuromoji'));

    function objectSort(object) {
        var sorted = [];
        var array = [];
        for (key in object) {
            if (object.hasOwnProperty(key)) {
                array.push( { k: key, v: object[key] });
            }
        }
        array.sort(function(a, b){
             return (a.v > b.v) ? -1 : 1;
        }); 
     
        for (var i = 0; i < array.length; i++) {
            sorted[array[i].k] = array[i].v;
        }
        return sorted;
    }

    function addWord(word, page){
        var i ,l = R.Items.length;
        var w = [];
        word = word.toString();
        if( typeof wordList[word] === 'undefined' ){
            for(i=0;i<l;i++){ w.push(0); }
            w[page] = 1;
            wordList[word] = w; 
        }
        else{ wordList[word][page] += 1; }
    }

    function tokenCount( token, page ){
        var i, l = token.length;
        var word = '', w, t , prev;
        var counter = 0;
        //console.table( token );
        wordCounter[page-0] = counter;

        if( token.length === 0 ){
            return null;
        }

        prev = token[0];
        if( prev.pos === '名詞' ) { word = prev.surface_form; }

        for( i=1;i<l;i++){
            t = token[i]
            w = t.surface_form;
            if( t.pos === '名詞' && t.pos_detail_1 !== '数' ) {
                if( w  !== "、" ){
                    word += w;
                }
                else{
                    if( word.length > 1 ){
                        addWord(word,page);
                        counter++;
                    }
                    word = '';                    
                }
            }
            else{
                if( word.length > 1 ){
                    addWord(word,page);
                    counter++;
                }
                word = '';
            }
        }
        if( word.length > 1 ){
            addWord(word,page);
            counter++;
        }

        //wordList = objectSort(wordList);
        wordCounter[page] = counter;

        //console.log( wordList );
        return wordList;
    }

    function getPageBody(page){
        var item = R.Items[page];
        var doc = item.contentDocument || item.contentWindow.document;
        var body = doc.getElementsByTagName('body')[0];
        return body;
    }
    
    function getItemList(){
        var item, items = R.Items;
        var i, l = items.length;
        var body, list = [];
        
        if( l === 0) { return null; }
        for(i=0;i<l;i++){
            item = items[i];
            body = getPageBody(i);            
            list.push(body.innerText);
        }
        return list;
    }
    
    function tfidf(){
        var i, l, count;
        var tf, df, idf, N , Z;
        var tmp = [];
        
        l = N = wordCounter.length;
        
        function sum(list){
            var i,l = list.length;
            var sum =0;
            for(i=0;i<l;i++){
                sum += list[i];
            }
            return sum;
        }
        
        for(i=0;i<l;i++){ tmp[i] = []; }
        
        for (list in wordList) {
            if (wordList.hasOwnProperty(list)) {
                count = wordList[list];
                for(i=0;i<l;i++){
                    if( count[i] >= 1 ){
                        Z = wordCounter[i];
                        tf = count[i] / Z;
                        df = sum( count );
                        idf = Math.log( N / df ) + 1;
                        //console.log( list, i, count[i], Z, tf, df);
                        //console.log( list, i , tf * idf);
                        tmp[i][list] = tf*idf ;
                    }
                }
            }
        }
        for(i=0;i<l;i++){ tmp[i] = objectSort(tmp[i]); }
        return tmp;
    }


    Bibi.plugin.bind("load", function(){

        var textList = getItemList();

        kuromoji.builder({ dicPath: DIC_URL }).build(function (error, _tokenizer) {
            var i,l = textList.length;
            var tokens;
            
            if (error != null) {
                console.log(error);
                return;
            }
            tokenizer = _tokenizer;

            // Kuromoji Ready!
            wordList = [];
            for(i=0;i<l;i++){
                tokens = tokenizer.tokenize( textList[i] );
                tokenCount( tokens, i );                    
            }

            Bibi.plugin.addMenu(
              { id: "Kanamoji",
                label: "kuromoji do it",
                img: "../plugin/icon/ic_error_grey600_18dp.png" },
            function(){
                var list , w , i =1;
                
                //console.log(wordList);
                //console.log(wordCounter);
                list = tfidf();
                for(w in list){
                    if (list.hasOwnProperty(w)) {
                        console.log( 'page'+i, list[w] );
                        i++;
                    }
                }
                
                C.Panel.toggle();
            });
        });  
    });
}

// Init
Bibi.plugin.kanamoji.init();