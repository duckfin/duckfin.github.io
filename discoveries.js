function DISCOVERY() {
	this.display = "";
	this.bought = 0;
	this.addCheck = function () {
		return false;
	};
	this.buy = function () {
		if(resources['research']==resources['researchMax'] && this.bought==0) {
			this.bought = 1;
			resources['research'] = 0;
			resources['researchMax'] *= 2.25;
			this.addCheck();
		}
	}
};

var discoveries = new Array();

discoveries["formalWorship"] = (function () {
	var obj = new DISCOVERY();
	obj.display = "Formal Worship";
	obj.addCheck = function () {
		$('#churchBuildingDiv').css({"visibility":"visible","display":"inline"});
		$('#formalWorshipButton').css({"visibility":"hidden","display":"none"});
		activity("Churches are expensive, but allow you to assign a Cleric who converts Worship into Influence.");
		return false;
	};
	return obj;
})();

discoveries["selfImprovement"] = (function () {
	var obj = new DISCOVERY();
	obj.display = "Self Improvement";
	obj.addCheck = function () {
		$('#populationPanelSelect').css({"visibility":"visible","display":"inline"});
		$('#selfImprovementButton').css({"visibility":"hidden","display":"none"});
		activity("Click on 'Population' to access growth for each citizen.");
		return false;
	};
	return obj;
})();