var worshipAddCheckFunctions = [
	function () {
		if(resources["worship"]>=3) {
			activity("Use the Destroy Wood/Stone miracles if your stash gets too full.");
			worshipAddCheck = worshipAddCheckFunctions.shift();
		}
	},
	function () {
		if(resources["worship"]>=5) {
			$('#miracleWoodDiv').css({"visibility":"visible","display":"inline"});
			activity("Use the Create Wood miracle to get an instant boost of wood.");
			worshipAddCheck = worshipAddCheckFunctions.shift();
		}
	},
	function () {
		return false;
	}
];

var tentTriggerOnBuyFunctions = [
	function () {
		activity("Worshipers will join your faith quicker the happier your people are.");
		building["tent"].triggerOnBuy = tentTriggerOnBuyFunctions.shift();
	},
	function () {
		return false;
	}
];