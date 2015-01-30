/*
 * BiB/i Plugin 
 * Bulk develop EPUBCFI
 */

Bibi.plugin.epubcfi = {
  name : "EPUBCFI-dev",
  discription: "Bulk develop EPUBCFI",
  author      : "Shunsuke Ito",
  version     : "0.0",
  Build       : "2015-01-30"
};

Bibi.plugin.epubcfi.init = function(){
    O.log(2, "plugin " + this.name + " loaded");

    function makeRangePath( anchorPath, focusPath ){
        var i,l ,count =0, path = [];
        var anc = anchorPath.split('/'),
            foc = focusPath.split('/');

        for(i=0; l=anc.length , i<l; i++){
            if( anc[i] === foc[i] ){
                count++;
                path.push( anc[i] );
            }
            else{
                break;
            }
        }
        anc.splice(0,count);
        foc.splice(0,count);

        return {
            parent: path.join('/'),
            start : '/' + anc.join('/'),
            end   : '/' + foc.join('/')
        };
    }

    function objtoCFIpath(obj){
        var o = obj,
            p = o.parentNode,
            txtNodeCount = 0,
            c, i ,count ,str;
        var list = [];

        c = p.childNodes;
        i = 0;
        while( c[i] && c[i] != o ){
            if( c[i].nodeType === 3 ){ txtNodeCount++; } // 3 = TEXT_NODE
            i++;
        }

        // 奇数カウント
        list.push( (txtNodeCount *2) +1 );

        while ( p ) {
            if( typeof p.childNodes === 'undefined') { break; }
            c = p.childNodes;
            i = count = 0;

            while( c[i] ){
                if( c[i].nodeType === 1){ count++; } // 1 = ELEMENT_NODE
                if( c[i] == o ){
                    // テキストノードのみ
                    if( count === 0 ){ break; }
                    if( typeof c[i].id !== undefined && c[i].id.length > 0 ){
                        str = [ count*2, '[' , c[i].id ,']' ].join('');  
                    }
                    else {
                        str = count *2;
                    }
                    list.push( str );
                    break;
                }
                i++;
            }
            o = p;
            p = p.parentNode;
        }
      
        list.reverse();
        return list.join('/');
    }




    Bibi.plugin.bind("load", function(){

        var contents = document.getElementById('epub-contents');
        var iframes = contents.getElementsByTagName('iframe');
        var page , win, doc;
        var i,l = iframes.length;

        for(i=0;i<l;i++){
          page = iframes[i];

          if (page.contentDocument && page.className ==='item') {
            doc = page.contentDocument;
            win = page.contentWindow;

            var rangeer = ( function(){
                var inDoc = doc;
                var inWin = win;
                var id = page.id;
                return function(){
                    var range = inWin.getSelection();
                    var pageId = id;
                    var dom, anchorPath, focusPath, path;

                    if( range.type === 'None' ){ return null; }
                    dom = range.getRangeAt(0).cloneContents();
                    if( dom.textContent === '' ){ return null; }
                    console.log( pageId, dom.textContent );

                    anchorPath = objtoCFIpath( range.anchorNode ) +':'+ range.anchorOffset;
                    focusPath  = objtoCFIpath( range.focusNode )  +':'+ range.focusOffset;
                    path = makeRangePath( anchorPath, focusPath );

                    // TODO : make package-item path
                    console.log( 'spine:', B.Package.Spine );
                    console.log( 'items:', B.Package.Manifest.items );

                    console.log( path );
                    return path;
                };
            })();

            doc.addEventListener('mouseup', rangeer , true);

        }

    }

});



}

// Init
Bibi.plugin.epubcfi.init();