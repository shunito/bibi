/*
 * BiB/i Plugin 
 * Google Analytics for Bib/i
 */

Bibi.plugin.ga = {
	name: "Google Analytics",
	discription: "Google Analytics for Bib/i",
	author: "Shunsuke Ito",
	version: "0.1"
};

Bibi.plugin.ga.init = function(){
	O.log(2, "plugin " + this.name + " loaded");
	
	/////////////////////////////////////////////////////////////////
	// トラッキングコード設定
	var GAtrackingCode = 'UA-58887552-1';

	// ログインしている user_id を使用してトラッキングします。
	// var user_id = 'Shun10001';
	var userTracking = false;
	/////////////////////////////////////////////////////////////////
	
	var name;

	// GA トラッキングコード
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

	ga('create', GAtrackingCode , 'auto');
	if( userTracking && typeof user_id != "undefined" ){ ga('set','&uid', user_id ); }
	ga('send', 'pageview');

	Bibi.plugin.addEvent("loadEPUB", function(){
		name = B.Name
		ga('send', 'event', name , 'open', 'Bib/i' );
	});

	Bibi.plugin.addEvent("beforeBack", function(){
		ga('send', 'event', name , 'navi', 'back');
	});

	Bibi.plugin.addEvent("beforeForward", function(){
		ga('send', 'event', name , 'navi', 'forward');
	});

	Bibi.plugin.addEvent("focusPage", function(){
		var CurrentPages = R.getCurrentPages();
		ga('send', 'event', name , 'focus', CurrentPages.Start.PageIndex );
	});

	Bibi.plugin.addEvent("openPanel", function(){
		ga('send', 'event', name , 'menu', 'open');
	});

	Bibi.plugin.addEvent("laidOut", function(){
		var layout = [ S["book-display-mode"], S["spread-layout-axis"],S["page-size-format"] ].join("-");
		ga('send', 'event', name , 'layout', layout);
	});

}

// Init
Bibi.plugin.ga.init();