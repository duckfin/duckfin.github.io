function popDevelShowList() {
	var pd = document.getElementById("populationListDiv");
	pd.innerHTML = "";
	for(n of characters) {
		pd.innerHTML += '<a href="#" title="' + n.id + '" onclick="popDevel(\'' + n.id + '\')">' + n.name + '</a>';
	}
}

var popDevelElements = [];

function checkLinked(w,n) {
	for(l of n.links) {
		if(w.skillNodes.indexOf(l)>-1) {
			return true;
		}
	}
	for(l of w.skillNodes) {
		if(l.links.indexOf(n)>-1) {
			return true;
		}
	}
	return false;
}

function NODE(n,x,y,r,f,func) {
	this.n = n;
	this.x = x;
	this.y = y;
	this.r = r;
	this.f = f;
	this.onclick = function (w) {
		if(w.xp>=w.maxxp && w.skillNodes.indexOf(this)==-1 && checkLinked(w,this)) {
			w.xp-=w.maxxp;
			w.maxxp*=1.5;
			w.skillNodes.push(this);
			this.apply(w);
		}
	};
	this.apply = function (w) {return false;};
	this.links = [];
}

popDevelElements.push(new NODE("Strength",200,250,25,'#999'));
popDevelElements.push(new NODE("Intelligence",250,200,25,'#999'));
popDevelElements.push(new NODE("Charisma",300,250,25,'#999'));
popDevelElements.push(new NODE("Dexterity",250,300,25,'#999'));

for(c of characters){for(var i=0;i<4;i++) {c.skillNodes.push(popDevelElements[i]);}}

popDevelElements.push(function () {
	var r = new NODE("+5 Life",160,210,10,'#797');
	r.apply = function (w) {w.hp += 5;w.maxhp += 5;}
	r.links.push(popDevelElements[0]);
	return r;
}());

function popDevel(who,dx,dy) {
	who = function(){for(n of characters) {if(n.id==who) {return n;}}}();
	alert(who);
	dx = typeof dx !== 'undefined' ? dx : 0;
	dy = typeof dy !== 'undefined' ? dy : 0;
	var pd = document.getElementById("populationDevelopDiv");
	var pdcon = pd.getContext("2d");
	
	for(n of popDevelElements) {
		drawCircle(pdcon,n.x-dx,n.y-dy,n.r,(who.skillNodes.indexOf(n)==-1 ? '#000' : '#193'),n.f);
	}
}

function popOnLoad() {
	$('#populationDevelopDiv').click(function (e) {
		var clickedX = e.pageX - this.offsetLeft;
		var clickedY = e.pageY - this.offsetTop;
		for(n of popDevelElements) {
			if(Math.sqrt( Math.pow(clickedX-n.x,2)+Math.pow(clickedY-n.y,2) )<=n.r) {
				n.onclick();
				return false;
			}
		}
	});
}

