var storageMax = 75;
var maxPop = 10;
var peopleParts = 0;
var intervalsSinceSave = 0;
var activityNotes = [];
var autosave = 0;

for(var i=0;i<maxPop;i++) {
	characters[i] = new CHARACTER();
};

function worshipAddCheck() {
	if(resources["worship"]>=1) {
		$('#miraclePanelSelect').css({"visibility":"visible","display":"inline"});
		$('#miracleDestroyWoodDiv').css({"visibility":"visible","display":"inline"});
		$('#miracleDestroyStoneDiv').css({"visibility":"visible","display":"inline"});
		activity("Click the 'Miracle' pane to see available miracles.");
		worshipAddCheck = worshipAddCheckFunctions.shift();
	}
}

function gain(what,amount){
	resources[what] = Math.min(resources[what]+amount,resources[what+'Max']);
};

function checkCostBuy(what) {
	for(n of resourceList){
		if(resources[n]<building[what][n+"Cost"]) {
			return false;
		}
	}
	return true;
}

function buy(what){
	if(checkCostBuy(what)){
		resources["stone"] = resources["stone"] - building[what].stoneCost;
		resources["wood"] = resources["wood"] - building[what].woodCost;
		building[what].increase();
	};
};

function miracle(what) {
	if(what == "wood" && resources["worship"]>=50 && storageMax-totalResources()>=10) {
		resources["worship"] -= 50;
		resources["wood"] += 10;
	} else if(what == "destroyWood" && resources["worship"]>=2 && resources["wood"]>=10) {
		resources["worship"] -= 2;
		resources["wood"] -= 10;
	} else if(what == "destroyStone" && resources["worship"]>=2 && resources["stone"]>=10) {
		resources["worship"] -= 2;
		resources["stone"] -= 10;
	}
	updateAll();
};

window.setInterval(function(){
	gain('stone',assignments["stone"].quant/20);
	gain('wood',assignments["wood"].quant/20);
	gain('worship',assignments["unem"].quant/360);
	gain('research',assignments["elder"].quant/20);
	if(characters.length<maxPop){
		peopleParts+=(function (){
			var t = 0;
			for(n of characters){
				t+=n.emotion["happiness"];
			}
			return t;
		})()/characters.length/75*(1-characters.length/maxPop);
	}
	if(peopleParts>=1){
		peopleParts-=1;
		characters[characters.length] = new CHARACTER();
	}
	if(autosave == 1){
		intervalsSinceSave = intervalsSinceSave + 1;
		if(intervalsSinceSave >= 480) save();
		document.getElementById('savetime').innerHTML = Math.floor(120-(intervalsSinceSave/4));
	};
	for(i=0;i<activityNotes.length;i++){
		activityNotes[i].time--;
	};
	if(activityNotes.length>0){
		while(activityNotes[0].time<=0 && activityNotes.length>0) activityNotes.shift();
	};
	updateAll();
}, 250);

function save(){
	intervalsSinceSave = 0;
	var save = {
		stone: resources["stone"],
		cursors: cursors,
		wood: resources["wood"],
		building: building
	};
	localStorage.setItem("dfsave",JSON.stringify(save));
};

function load(){
	alert(discoveries.length);
	intervalsSinceSave = 0;
	var savegame = JSON.parse(localStorage.getItem("dfsave"));
	if(typeof savegame.stone != "undefined") resources["stone"] = savegame.stone;
	if(typeof savegame.cursors != "undefined") cursors = savegame.cursors;
	if(typeof savegame.wood != "undefined") resources["wood"] = savegame.wood;
	if(typeof savegame.building != "undefined") building = savegame.building;
	activity('Sorry, saving/loading not correctly implemented, please file complaint with management.');
	updateAll();
};

function removeSave(){
	localStorage.removeItem("dfsave");
};

function switchAutosave(){
	if(autosave == 0) {autosave = 1} else {autosave = 0};
	document.getElementById('asvar').innerHTML = autosave;
};	

function activity(note){
	var n = {
		text: note,
		time: 120
	};
	activityNotes.push(n);
};

activity("Assign Worshippers to jobs to produce materials");
activity("Recommended: Assign at least 5 Lumberjacks");

function displayActivity(){
	var res = '';
	for(i=0;i<activityNotes.length;i++){
		res = res + '<li style="opacity:' + (activityNotes[i].time>30 ? 1 : Math.floor((activityNotes[i].time)*100/30)/100) + '">' + activityNotes[i].text;
	};
	document.getElementById('activity').innerHTML = res;
};

function switchBuildings(){
	if(document.getElementById('buildings').style.visibility == 'hidden') {document.getElementById('buildings').style.visibility = 'visible'; document.getElementById('buildings').style.display = 'block';} else {document.getElementById('buildings').style.visibility = 'hidden'; document.getElementById('buildings').style.display = 'none';};
};

function outputTimeTil(rps,target) {
	if(rps>0){
		var stt = target/rps;
		var outa = [];
		outa.push((stt>=3600 ? Math.floor((stt%86400)/3600).toString()+":" : ""));
		outa.push((stt>=60 ? Math.floor((stt%3600)/60).toString()+":" : "00:"));
		outa.push(Math.floor(stt%60).toString());
		var out = "";
		$.each(outa,function (i,v) {out+= (v.length==1 ? "0"+v : v);});
		return out;
	} else {return -1;};
};

function updateAll(){

document.getElementById('woodText').innerHTML = "Wood: " + (Math.floor(resources['wood']*10)/10).toString()+"/"+Math.floor(resources['woodMax']).toString()+'&nbsp;('+(Math.floor(assignments["wood"].quant*40.0/20)/10).toString()+'/sec)';
	document.getElementById('woodFill').style.width = (Math.floor(resources['wood']*10000.0/resources['woodMax'])/100).toString()+'%';

document.getElementById('stoneText').innerHTML = "Stone: " + (Math.floor(resources['stone']*10)/10).toString()+"/"+Math.floor(resources['stoneMax']).toString()+'&nbsp;('+(Math.floor(assignments["stone"].quant*40.0/20)/10).toString()+'/sec)';
	document.getElementById('stoneFill').style.width = (Math.floor(resources['stone']*10000.0/resources['stoneMax'])/100).toString()+'%';
	
	for(n in assignments) {
		document.getElementById(n+'WorkerDisplay').innerHTML = (function () {
			var out = "";
			out += assignments[n].plural + ": " + assignments[n].quant;
			if(n=="unem" && characters.length<maxPop) {
				var s = (function (){
						var t = 0;
						for(n of characters){t+=n.emotion["happiness"];} return t;})()/characters.length/18.75*(1-characters.length/maxPop);
				out += " (" + outputTimeTil(s,1-peopleParts) + ")";
			};
			return out;
		})();
	};
	
	for(n in building) {
		document.getElementById(n+'Display').innerHTML = (function () {
			var out = "";
			out += building[n].plural+": ";
			out += building[n].quant.toString()+" (";
			var kicked = true;
			for(k of resourceList) {
				if(building[n][k+"Cost"]>0) {
					out += (kicked ? "" : ", ") + k.charAt(0).toUpperCase() + k.slice(1) + " " + Math.ceil(building[n][k+"Cost"]);
					kicked = false;
				};
			};
			return out+")";
		})();
	};
	document.getElementById('totalWorkerDisplay').innerHTML = " Total Population: "+characters.length.toString()+"/"+maxPop.toString();
	var wps = (Math.floor(assignments["unem"].quant*4000.0/360)/1000)
	document.getElementById('progressText').innerHTML = (Math.floor(resources['worship']*10)/10).toString()+" / "+Math.floor(resources['worshipMax']).toString()+'&nbsp;&nbsp;&nbsp;('+wps.toString()+'/sec)';
	document.getElementById('progressFill').style.width = (Math.floor(resources['worship']*10000.0/resources['worshipMax'])/100).toString()+'%';
	
	document.getElementById('discoveryText').innerHTML = "Discovery: " + (Math.floor(100*resources['research']/resources['researchMax'])).toString() + '%';
	document.getElementById('discoveryFill').style.width = (Math.floor(resources['research']*10000.0/resources['researchMax'])/100).toString()+'%';
	
	displayActivity();
};
