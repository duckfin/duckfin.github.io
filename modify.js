function showPane(what) {
	for(t of ["worker","building","miracle","discovery","population"]){
		var e = document.getElementById(t+'Div');
		e.style.visibility = "hidden";
		e.style.display = "none";
	};
	var e = document.getElementById(what+'Div');
	e.style.visibility = "visible";
	e.style.display = "inline";
	if(what=="population"){
		popDevelShowList();
	} else if(what=="building") {
		buildingDevelShow();
	}
};

function show(what) {
	base[what].shown = 1;
	if(base[what].type == "building") {
	};
}