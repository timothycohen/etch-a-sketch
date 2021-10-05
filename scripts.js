const canvas = document.querySelector('.sketch-inner');
const rangePara = document.querySelector('.rangePara');
const divCountSlider = document.querySelector('#divCountSlider');
const newButton = document.querySelector('#new');


divCountSlider.onmousemove = () => updateDivCount();
divCountSlider.onchange = () => updateDivCount();

function updateDivCount() {
	divCount = divCountSlider.value;
	rangePara.innerText = `Grid: ${divCount} x ${divCount}`;
}

newButton.onclick = () => createCanvas(divCount);

// initialize
createCanvas(divCountSlider.value);
rangePara.innerText = `Grid: ${divCountSlider.value} x ${divCountSlider.value}`;





function createDiv(width, height) {
	div = document.createElement('div');
	div.style.border = "solid lightGray 1px";
	div.style.width = `${width}px`;
	div.style.height = `${height}px`
	return div;
}


function createCanvas (divCount) {
	clearCanvas();

	let canvasStyles = window.getComputedStyle(canvas);
	let canvasWidthPX = canvasStyles.getPropertyValue('width').slice(0, -2);
	let canvasHeightPX = canvasStyles.getPropertyValue('height').slice(0, -2);

	let divWidth = `${canvasWidthPX/divCount}`;
	let divHeight = `${canvasHeightPX/divCount}`;

	for (let i = 0; i < divCount; i++){
		for (let j = 0; j < divCount; j++){	
		canvas.appendChild(createDiv(divWidth, divHeight));
		}
	}
}


function clearCanvas() {
	while (canvas.firstChild) {
		canvas.removeChild(canvas.firstChild);
	}
}