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
const eraser = document.querySelector('.svg');

// #################### Options Logic ####################

// when slider is changed: update div count, ui text, and ui sample div 
divCountSlider.onmousemove = () => updateDivCount();
divCountSlider.onchange = () => updateDivCount();

function updateDivCount() {
	divCount = divCountSlider.value;
	rangePara.innerText = `${divCount} x ${divCount}`;

	newDivSize = calcNewDiv(divCount);
	sample = createDiv(newDivSize[0], newDivSize[1]);
	sample.style.border = `solid ${bgColor} 1px`;
	sampleDiv.appendChild(sample)
	while (sampleDiv.children[1]) {
		sampleDiv.removeChild(sampleDiv.firstChild);
	}
}


// #################### Initialize ####################
let bgColor = 'whitesmoke';
let oldDivCount = divCountSlider.value;
createCanvas(divCountSlider.value);
updateDivCount();
let mouse = false;
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
	if (mouse === false){
		mouse = true;
		canvas.style.cursor = 'not-allowed';
		previousDrawType = drawType;
		drawType = 'erase';
		addIndicator();
	}
}

function mouseUp () {
	if (mouse === true){
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
			rgba = buildRGBA(rgb);
			color = lighten(rgba);
			break;
		case 'darken':
			color = 'brown';
			break;
		case 'erase':
			color = bgColor;
			break;
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
	
	switch(drawType){
		case 'color': colorSelection.classList.add('selected'); break;
		case 'rgb': randomColorButton.classList.add('selected'); break;
		case 'lighten': lightenButton.classList.add('selected'); break;
		case 'darken': darkenButton.classList.add('selected'); break;
		case 'erase': eraser.classList.add('selected'); break;
	}
};



// #################### Todo: Lighten and Darken ####################


// var LightenColor = function(color, percent) {
// 	var num = parseInt(color,16),
// 	amt = Math.round(2.55 * percent),
// 	R = (num >> 16) + amt,
// 	B = (num >> 8 & 0x00FF) + amt,
// 	G = (num & 0x0000FF) + amt;

// 	return (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
// };


// for (let i = 0; i < 10; i++){
// 	console.log(LightenColor('3faa3f', 65))
// }







// function buildRGBA (rgb){
// 	if (rgb.slice(3,4) === 'a'){
// 		return rgb;
// 	}
// 	else{
// 		rgba = rgb.slice(3);
// 		rgba = rgba.slice(0, -1);
// 		rgba = 'rgba' + rgba + ', 1)'
// 		return rgba;
// 	}
// }


// function lighten(rgba){
// 	alpha = rgba.slice(-2, -1);
// 	if (alpha == 1){
// 		alpha = alpha - .1;
// 	}
// 	else if (alpha == 0){
// 	}
// 	else
// 	{
// 		alpha = alpha - .1;
// 	}
// 	rgba = rgba.slice(0, -3) + ' ' + alpha + ')';
// 	console.log(rgba)
// 	console.log('lightened')
// 	return rgba;
// }