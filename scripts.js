// #################### Query Selectors ####################

const canvas = document.querySelector('.sketch-inner');
const canvasWrapper = document.querySelector('.sketch-wrapper');
const newButton = document.querySelector('#new');
const mosaicButton = document.querySelector('#newMosaic');
const divCountSlider = document.querySelector('#divCountSlider');
const rangePara = document.querySelector('.rangePara');
const sampleDiv = document.querySelector('.sampleDiv');
const colorSelection = document.querySelector('#colorSelection');
const randomColorButton = document.querySelector('#randomColorButton');
const darkenButton = document.querySelector('#darkenButton');
const lightenButton = document.querySelector('#lightenButton');
const eraser = document.querySelector('.eraser');
const kbd = document.querySelector('.kbc-button');

// #################### Options Logic ####################

// when slider is changed: update div count, ui text, and ui sample div 
divCountSlider.onmousemove = () => updateDivCount();
divCountSlider.onchange = () => updateDivCount();

function updateDivCount() {
	divCount = divCountSlider.value;
	rangePara.innerText = `${divCount} x ${divCount}`;
	newSampleDiv()
}

function newSampleDiv(){
	divCount ? newDivSize = calcNewDiv(divCount) : newDivSize = calcNewDiv(oldDivCount);
	sample = createDiv(newDivSize[0], newDivSize[1]);
	sample.style.border = `solid ${bgColor} 1px`;
	sampleDiv.appendChild(sample)
	while (sampleDiv.children[1]) {
		sampleDiv.removeChild(sampleDiv.firstChild);
	}
}


// #################### Initialize ####################
let bgColor = 'rgb(251,251,251)';
let oldDivCount = divCountSlider.value;
createCanvas(divCountSlider.value);
updateDivCount();
let mouse = false;
let key = false;
let previousDrawType = colorSelection.value;
let drawType = 'color';
addIndicator();


// #################### Canvas Creation and Resizing ####################

newButton.onclick = () => createCanvas(divCount);
mosaicButton.onclick = () => createCanvas(divCount, 'rgb');

window.onresize = () => resizeDiv();

function calcNewDiv(divCount) {
	let canvasStyles = window.getComputedStyle(canvas);
	let canvasWidthPX = canvasStyles.getPropertyValue('width').slice(0, -2);
	let canvasHeightPX = canvasStyles.getPropertyValue('height').slice(0, -2);

	let divWidth = `${canvasWidthPX/divCount}`;
	let divHeight = `${canvasHeightPX/divCount}`;

	return [divWidth, divHeight]
}

function createDiv(width, height) {
	div = document.createElement('div');
	div.style.width = `${width}px`;
	div.style.height = `${height}px`
	return div;
}

function resizeDiv() {
	newDivSize = calcNewDiv(oldDivCount);
	for (let i = 0; i < oldDivCount*oldDivCount; i++){
		canvas.children[i].style.width = `${newDivSize[0]}px`;
		canvas.children[i].style.height = `${newDivSize[1]}px`;
	}
	newSampleDiv();
}

function createCanvas (divCount, bg = bgColor) {
	oldDivCount = divCount;
	clearCanvas();

	let newDivSize = calcNewDiv(divCount);

	bg === 'rgb' ? random = true : random = false;

	for (let i = 0; i < divCount; i++){
		for (let j = 0; j < divCount; j++){	
			newDiv = createDiv(newDivSize[0], newDivSize[1]);
			random === true ? bg = `${getRandomColor()}` : {};
			newDiv.style.backgroundColor = bg;
			canvas.appendChild(newDiv);
		}
	}
}

function clearCanvas() {
	while (canvas.firstChild) {
		canvas.removeChild(canvas.firstChild);
	}
}


// #################### Erase Logic ####################

function mouseDown () {
	if (mouse === false && key === false){
		mouse = true;
		canvas.style.cursor = 'not-allowed';
		previousDrawType = drawType;
		drawType = 'erase';
		addIndicator();
	}
}

function mouseUp () {
	if (mouse === true && key === false){
		mouse = false;
		canvas.style.cursor = 'crosshair';
		drawType = previousDrawType;
		addIndicator();
	}
}

canvas.onmousedown = () => mouseDown()
canvas.onmouseup = () => mouseUp()
canvasWrapper.onmouseleave = () => mouseUp()
eraser.onclick = () => mouse === true ? mouseUp() : mouseDown();

// #################### No Input Logic ####################


window.onkeydown = (e) => keyDown(e)
window.onkeyup = (e) => keyUp(e)

function keyDown (e){
	if (key === false && e.key === 'w' && mouse === false){
		key = !key;
		canvas.style.cursor = 'pointer';
		previousDrawType = drawType;
		drawType = 'none';
		addIndicator();
	}
};

function keyUp (e){
	if (key === true && e.key === 'w' && mouse === false){
		key = !key;
		canvas.style.cursor = 'crosshair';
		drawType = previousDrawType;
		addIndicator();
	}
};

// #################### Draw Logic ####################

colorSelection.onclick = () => drawType = 'color';
randomColorButton.onclick = () => drawType = 'rgb';
lightenButton.onclick = () => drawType = 'lighten';
darkenButton.onclick = () => drawType = 'darken';

function getRandomColor() {
	let randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
	return randomColor;
}

canvas.addEventListener("mouseover", function( event ) {
	switch (drawType){
		case 'rgb':
			color = `${getRandomColor()}`;
			break;
		case 'color':
			color = colorSelection.value;
			break;
		case 'lighten':
			rgb = getComputedStyle(event.target).getPropertyValue("background-color");
			hex = RGBToHex(rgb)
			color = shade(hex, .1)
			break;
		case 'darken':
			rgb = getComputedStyle(event.target).getPropertyValue("background-color");
			hex = RGBToHex(rgb)
			color = shade(hex, -.1)
			break;
		case 'erase':
			color = bgColor;
			break;
		default:
			return;
	}
	event.target.style.backgroundColor = color;
});



// #################### Selection Indicators ####################
window.onclick = () => addIndicator();

function addIndicator () {
	colorSelection.classList.remove('selected');
	randomColorButton.classList.remove('selected');
	lightenButton.classList.remove('selected');
	darkenButton.classList.remove('selected');
	eraser.classList.remove('selected');
	kbd.classList.remove('active');
	
	switch(drawType){
		case 'color': colorSelection.classList.add('selected'); break;
		case 'rgb': randomColorButton.classList.add('selected'); break;
		case 'lighten': lightenButton.classList.add('selected'); break;
		case 'darken': darkenButton.classList.add('selected'); break;
		case 'erase': eraser.classList.add('selected'); break;
		case 'none': kbd.classList.add('active'); break;
	}
};

// #################### Lighten and Darken ####################

// source https://css-tricks.com/converting-color-spaces-in-javascript/

function RGBToHex(rgb) {
	// Choose correct separator
	let sep = rgb.indexOf(",") > -1 ? "," : " ";
	// Turn "rgb(r,g,b)" into [r,g,b]
	rgb = rgb.substr(4).split(")")[0].split(sep);

	let r = (+rgb[0]).toString(16),
			g = (+rgb[1]).toString(16),
			b = (+rgb[2]).toString(16);

	if (r.length == 1)
		r = "0" + r;
	if (g.length == 1)
		g = "0" + g;
	if (b.length == 1)
		b = "0" + b;

	return "#" + r + g + b;
}

// source: https://codepen.io/Loutrinos/pen/dWjRKE?editors=0012
function shade(color, percent) {
	let f=parseInt(color.slice(1),16);		// take off the # and then parse it into an integer with base 16
	let t=percent<0?0:255;								// if percent is <0 t is 0, so it'll darken
	let p=percent<0?percent*-1:percent;		// p is the absolute value of percent
	let R=f>>16;													// the right shift operator will drop the last bit which in binary is equivalent to dividing by 2. f>>16 = f/(2^16) which converts our binary number into a hex digit.
	let G=f>>8&0x00FF;										// bitwise and returns 1 where both bits are 1
	let B=f&0x0000FF;

	return "#"+
	(0x1000000 +
	(Math.round((t-R)*p)+R)*0x10000 +
	(Math.round((t-G)*p)+G)*0x100 +
	(Math.round((t-B)*p)+B)).toString(16).slice(1);
}