var namearray = ["John","Paul","Sam","Andrew","Alex","Craig","Gene","Steve","James"];

function getID() {
	for(var i=Math.floor(10000*Math.random()),t=0;t<10000;t++,i++){
		if($.grep(characters,function(e){return e.id==i;}).length==0) {
			return i;
		}
	}
}

function CHARACTER() {
	this.stats = {STR:20,DEX:20,INT:20,CHA:20};
	this.hp = 10;
	this.maxhp = 10;
	this.xp = 0;
	this.maxxp = 10;
	this.age = 1;
this.level = 0;
	this.name = namearray[Math.floor(namearray.length*Math.random())];
	this.id = getID();
	this.assign = assignments["unem"];
	assignments["unem"].quant++;
	this.efficiency = new Array();
	for(n of ["stone","wood","unem","research"]) {
		this.efficiency[n] = 0;
	};
	this.emotion = {faith:0.75,fear:0.25,happiness:0.75};
	this.skillNodes = [];
this.calcMaxXp = function(){return 10*Math.exp(2,this.level);};
}

var characters = new Array();

function openWorkerDiv(what,which) {
	if(assignments[what].max==-1 || assignments[what].max>assignments[what].quant){
		var wad = document.getElementById('workerAssignDiv');
		var ihtml = "";
		wad.style.visibility = "visible";
		wad.style.display = "block";
		for(n of characters){
			
			if(which=="assign" && n.assign == assignments["unem"]){
				ihtml += '<a href="#" onclick="'+which+'Worker(\''+what+'\','+n.id.toString()+');return false;">'+n.name+'</a> ';
			} else if(which=="deassign" && n.assign==assignments[what]) {
				ihtml += '<a href="#" onclick="'+which+'Worker(\''+what+'\','+n.id.toString()+');return false;">'+n.name+'</a> ';
			}
		}
		wad.innerHTML = ihtml;
	} else {activity("Cannot assign more "+assignments[what].plural);}
}

function assignWorker(what,who){
	var w = $.grep(characters,function(e){return e.id==who;})[0]
	if(w.assign==assignments["unem"]){
		assignments[what].assign(w);
	}
	closeWorkerDiv();
}

function deassignWorker(what,who){
	var w = $.grep(characters,function(e){return e.id==who;})[0]
	assignments[what].deassign(w);
	closeWorkerDiv();
}

function closeWorkerDiv(){
	var wad = document.getElementById('workerAssignDiv');
	wad.style.display = "none";
	updateAll();
}
