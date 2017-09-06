var resourceList = ["worship","wood","stone","research"];
var resources = new Array();
for(n of resourceList) {
	resources[n] = 0;
};

resources['worshipMax'] = 100;
resources['woodMax'] = 50;
resources['stoneMax'] = 50;
resources['researchMax'] = 100;

function totalResources() {
	var t = 0;
	for(n of ["stone","wood"]) {
		t += resources[n];
	};
	return t;
};

var bonuses = new Array();
bonuses["storageMax"] = 0;

function ASSIGNMENT() {
	this.plural = "";
	this.max = -1;
	this.quant = 0;
	this.what = "";
	this.tick = function () {
		return false;
	};
	this.assign = function (w) {
		this.quant++;
		w.assign.deassign(w);
		w.assign.quant--;
		w.assign = this;
		this.addCheck();
	};
	this.deassign = function (w) {
		if(w.assign == this){
			this.quant--;
			assignments["unem"].quant++;
			w.assign = assignments["unem"];
		};
	};
	this.addCheck = function () {
		return false;
	};
};

var assignments = new Array();
assignments["wood"] = (function () {
	var obj = new ASSIGNMENT();
	obj.plural = "Lumberjacks";
	obj.what = "wood";
	obj.addCheck = function () {
		activity("Try gathering 10 wood to build a tent.");
		this.addCheck = function () {return false;};
	};
	return obj;
})();
assignments["stone"] = (function () {
	var obj = new ASSIGNMENT();
	obj.plural = "Miners";
	obj.what = "stone";
	obj.addCheck = function () {
		activity("Stashes increase the total amount of resources you can keep.");
		this.addCheck = function () {return false;};
	};
	return obj;
})();
assignments["unem"] = (function () {
	var obj = new ASSIGNMENT();
	obj.plural = "Worshipers";
	obj.what = "unem";
	return obj;
})();
assignments["elder"] = (function () {
	var obj = new ASSIGNMENT();
	obj.plural = "Elders";
	obj.what = "elder";
	obj.max = 0;
	obj.addCheck = function () {
		activity("Once the Research Bar fills completely, you can choose a new Discovery.");
		$('#discoveryBarDiv').css({"visibility":"visible","display":"inline"});
		$('#discoveryPanelSelect').css({"visibility":"visible","display":"inline"});
		this.addCheck = function () {return false;};
	};
	return obj;
})();
assignments["cleric"] = (function () {
	var obj = new ASSIGNMENT();
	obj.plural = "Clerics";
	obj.what = "cleric";
	obj.max = 0;
	obj.addCheck = function () {
		activity("Clerics will continually convert a small amount of Worship to Influence.");
		this.addCheck = function () {return false;};
	};
	return obj;
})();

function BUILDING() {
	this.shown = 0;
	this.type = "";
	this.plural = "";
	this.quant = 0;
	this.worshipCost = 0;
	this.worshipMult = 1;
	this.stoneCost = 0;
	this.stoneMult = 1;
	this.woodCost = 0;
	this.woodMult = 1;
	this.researchCost = 0;
	this.researchMult = 1;
	this.increase = function() {
		this.quant += 1;
		this.worshipCost = Math.floor(this.worshipCost*this.worshipMult);
		this.stoneCost = Math.floor(this.stoneCost*this.stoneMult);
		this.woodCost = Math.floor(this.woodCost*this.woodMult);
		this.onBuy();
		this.triggerOnBuy();
	};
	this.onBuy = function() {return false;};
	this.onLose = function() {return false;};
	this.triggerOnBuy = function () {return false;};
}

var building = new Array();

building["tent"] = new BUILDING();
building["tent"].type = "building";
building["tent"].plural = "Tents";
building["tent"].stoneCost = 0;
building["tent"].stoneMult = 1.3;
building["tent"].woodCost = 10;
building["tent"].woodMult = 1.6;
building["tent"].onBuy = function() {maxPop+=2;};
building["tent"].onDestroy = function() {
	for(var i=0;i<2;i++) {
		if(workers.unem>=1) {workers.unem-=1;}
		else if(workers.stone>=1) {workers.stone-=1;}
		else if(workers.wood>=1) {workers.wood-=1;}
	};
};
building["tent"].triggerOnBuy = function () {
	this.stoneCost = 8;
	activity("You now have space for two more people, who will come to your faith over time.");
	activity("Try assigning a few Miners and building a Stash.");
	$('#stashBuildingDiv').css({"visibility":"visible","display":"inline"});
	$('#stoneBar').css({"visibility":"visible","display":"inline-block"});
	$('#stoneWorkerDiv').css({"visibility":"visible","display":"inline"});
	building["tent"].triggerOnBuy = tentTriggerOnBuyFunctions.shift();
};

building["stash"] = new BUILDING();
building["stash"].type = "building";
building["stash"].plural = "Stashes";
building["stash"].stoneCost = 20;
building["stash"].stoneMult = 1.6;
building["stash"].woodCost = 10;
building["stash"].woodMult = 1.4;
building["stash"].onBuy = function() {resources['woodMax']+=25;resources['stoneMax']+=25;};
building["stash"].onDestroy = function() {
	resources['woodMax']-=25;resources['stoneMax']-=25;};
building["stash"].triggerOnBuy = function () {
	$('#elderhutBuildingDiv').css({"visibility":"visible","display":"inline"});
	activity("Elder Huts allow the permanent assignment of Elders - those who lead your people to new discoveries.");
	building["stash"].triggerOnBuy = function () {return false;};
};

building["elderhut"] = new BUILDING();
building["elderhut"].type = "building";
building["elderhut"].plural = "Elder Huts";
building["elderhut"].stoneCost = 30;
building["elderhut"].stoneMult = 1.5;
building["elderhut"].woodCost = 30;
building["elderhut"].woodMult = 1.5;
building["elderhut"].onBuy = function() {
	assignments["elder"].max++;
};
building["elderhut"].onDestroy = function() {};
building["elderhut"].triggerOnBuy = function () {
	$('#elderWorkerDiv').css({"visibility":"visible","display":"inline"});
	activity("Once assigned, Elders stay for life.");
	building["elderhut"].triggerOnBuy = function () {return false;};
};

building["church"] = new BUILDING();
building["church"].type = "building";
building["church"].plural = "Churches";
building["church"].worshipCost = 100;
building["church"].worshipMult = 2.1
building["church"].stoneCost = 100;
building["church"].stoneMult = 2.1;
building["church"].woodCost = 100;
building["church"].woodMult = 2.1;
building["church"].onBuy = function() {
	assignments["cleric"].max++;
};
building["church"].onDestroy = function() {};
building["church"].triggerOnBuy = function () {
	$('#clericWorkerDiv').css({"visibility":"visible","display":"inline"});
	building["church"].triggerOnBuy = function () {return false;};
};
