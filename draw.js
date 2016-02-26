function drawCircle(context,cx,cy,rad,strokeStyle,fillStyle) {
	context.beginPath();
	context.arc(cx, cy, rad, 0, 2 * Math.PI, false);
	if(fillStyle){
		context.fillStyle = fillStyle;
		context.fill();
	}
	context.lineWidth = 2;
	context.strokeStyle = strokeStyle;
	context.stroke();
}