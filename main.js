var stickyArr;
var stickyArrOld;

btnNew.addEventListener('click', onNewSticky);
btnUndo.addEventListener('click', onUndo);

function getRand(min, max) { //clean
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function onUndo (e) { //clean
	e.preventDefault();

	let stickyOld = document.body.querySelectorAll('.sticky');

	for (i = 0; i < stickyOld.length; i++) {
		document.body.removeChild(stickyOld[i]);
	}
	if (stickyArrOld) {
		for (i = 0; i < stickyArrOld.length; i++) {
			onNewSticky(e, stickyArrOld[i]);
		}
	}
	saveStickies();
}

function onNewSticky(e, stickyCurr) {
	e.preventDefault();

	let sticky = document.createElement('div');
	let stickyBtnForm = document.createElement('form');
	let txt = document.createElement('textarea');

	txt.setAttribute('spellcheck', 'false');
	txt.setAttribute('maxlength', '1500');

	document.body.appendChild(sticky);
	sticky.appendChild(stickyBtnForm);
	sticky.appendChild(txt);

	if (!stickyCurr) {
		sticky.style.top = getRand(0, 55,5) + '%';
		sticky.style.left = getRand(0, 77.5) + '%';
		txt.style.fontSize = 'xx-large';

		sticky.classList.add('sticky', 'stickyColor' + getRand(1, 5));
		saveStickies();
	}
	else {
		sticky.style.top = stickyCurr.posY;
		sticky.style.left = stickyCurr.posX;
		txt.value = stickyCurr.txt;
		txt.style.fontSize = stickyCurr.txtSize;

		sticky.classList.add('sticky', stickyCurr.stickyColor);
	}

	let stickyBtn1 = document.createElement('button');
	stickyBtn1.innerHTML = 'Color';
	stickyBtn1.classList.add('stickyBtn');
	stickyBtnForm.appendChild(stickyBtn1);

	let stickyBtn2 = document.createElement('button');
	stickyBtn2.innerHTML = 'Delete';
	stickyBtn2.classList.add('stickyBtn');
	stickyBtnForm.appendChild(stickyBtn2);

	sticky.addEventListener('mouseover', onStickyHover);
	txt.addEventListener('input', onInput);
	txt.addEventListener('focusout', saveStickies);
	stickyBtn1.addEventListener('click', onChangeColor);
	stickyBtn2.addEventListener('click', onDelete);
}

function onInput() { //clean
	let fontSizeArr = [
	'xx-small', 'x-small', 'small', 'medium', 'large', 'x-large', 'xx-large'
	];

	while (this.clientHeight == this.scrollHeight && this.style.fontSize != 'xx-large') {
		this.style.fontSize = fontSizeArr[fontSizeArr.indexOf(this.style.fontSize) + 1];
	}
	while (this.clientHeight != this.scrollHeight && this.style.fontSize != 'xx-small') {
		this.style.fontSize = fontSizeArr[fontSizeArr.indexOf(this.style.fontSize) - 1];
	}
}

function onChangeColor(e) { //clean
	e.preventDefault();

	let sticky = this.parentNode.parentNode;
	let oldColorId = parseInt(sticky.classList[1][11]);
	let newColorId = oldColorId + 1;

	if (newColorId > 5) {
		newColorId = 1;
	}
	sticky.classList.remove('stickyColor' + oldColorId);
	sticky.classList.add('stickyColor' + newColorId);
	document.body.appendChild(sticky);
	saveStickies();
}

function onDelete(e) { //clean
	e.preventDefault();

	document.body.removeChild(this.parentNode.parentNode);
	saveStickies();
}

function onStickyHover() {
	let that = this;
	let mouseDown;

	stickyBlur('blur');
	onmouseout = () => {
		if (!mouseDown) {
			stickyBlur('clear');
		}
	}

	that.addEventListener('mousedown', stickyHold);
	function stickyHold() {
		mouseDown = true;
		stickyBlur('blur');

		document.onmouseup = stickyRelease;

		if (event.target === that) {
			document.onmousemove = stickyDrag;
			document.body.appendChild(that);
			saveStickies()
		}
		
		function stickyDrag() {
			that.style.top = event.clientY + 'px';
			that.style.left = event.clientX + 'px';
		}

		function stickyRelease() {
			mouseDown = false;
			stickyBlur('clear');
			document.onmousemove = null;
		}
	}	

	function stickyBlur(state) {
		var sticky = document.querySelectorAll('.sticky');
		for (i = 0; i < sticky.length; i++) {
			if (state == 'blur') {
				sticky[i].classList.add('stickyBlur');
			}
			else {
				sticky[i].classList.remove('stickyBlur');
			}
		}
		that.classList.remove('stickyBlur');
	}
}

function saveStickies() { //clean
	stickyArrOld = stickyArr;
	stickyArr = [];
	var sticky = document.querySelectorAll('.sticky');

	for (i = 0; i < sticky.length; i++) {
		stickyCurr = sticky[i];
		stickyArr.push({
			posX: stickyCurr.style.left,
			posY: stickyCurr.style.top,
			stickyColor: stickyCurr.classList[1],
			txt: stickyCurr.lastChild.value,
			txtSize: stickyCurr.lastChild.style.fontSize
		});
	}
	console.clear();
	console.table(stickyArr);
	console.table(stickyArrOld);
}