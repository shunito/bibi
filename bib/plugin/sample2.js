/*
 * BiB/i Plugin 
 * Sample 2
 */

Bibi.plugin.sample2 = {
	name : "sample2",
	discription: "sample plugin 2"
};

Bibi.plugin.sample2.init = function(){
	O.log(2, "plugin " + this.name + " loaded");

	Bibi.plugin.addEvent("loadEPUB", function(){
		console.log("Plugin call:: sample2 loadEPUB");
	});

	Bibi.plugin.addEvent("beforeForward", function(){
		console.log("Plugin call:: sample2 beforeForward 1");
	});

	Bibi.plugin.addEvent("beforeBack", function(){
		console.log("Plugin call:: sample2 beforeBack 2");
	});

	Bibi.plugin.addEvent("closePanel", function(){
		console.log("Plugin call:: sample2 closePanel");
	});

	Bibi.plugin.addEvent("laidOut", function(){
		console.log("Plugin call:: sample2 laidOut");
	});

	Bibi.plugin.addEvent("focusPage", function(){
		console.log("Plugin call:: sample2 focusPage");
	});

}

// Init
Bibi.plugin.sample2.init();