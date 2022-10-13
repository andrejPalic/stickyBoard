window.onload = onLoad;

var stickyArr;
var stickyArrOld;

btnNew.addEventListener('click', onNewSticky);
btnUndo.addEventListener('click', onUndo);

function getRand(min, max) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function onLoad(e) { //clean
	let stickyArrJSON = localStorage.getItem('stickyArrSave');
	stickyArr = JSON.parse(stickyArrJSON);

	if (stickyArr) {
		for (i = 0; i < stickyArr.length; i++) {
			onNewSticky(e, stickyArr[i]);
		}
		saveStickies();
	}
}

function onUndo (e) {
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
	let txt = document.createElement('textarea');

	txt.setAttribute('spellcheck', 'false');
	txt.setAttribute('maxlength', '1500');

	sticky.appendChild(txt);
	document.body.appendChild(sticky);

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

	sticky.addEventListener('mouseover', onStickyHover);
	txt.addEventListener('input', onInput);
	txt.addEventListener('focusout', saveStickies);

	addButtons(sticky);
}

function addButtons(sticky) {
	let stickyBtnForm = document.createElement('form');
	let stickyBtnNames = ['Color', 'placeholder', 'Delete'];

	sticky.appendChild(stickyBtnForm);

	for (j = 0; j < stickyBtnNames.length; j++) {
		let stickyBtn = document.createElement('button');
		stickyBtn.innerHTML = stickyBtnNames[j];
		stickyBtnForm.appendChild(stickyBtn);
		if (j != 2) {
			stickyBtn.addEventListener('click', onChangeColor);
		}
		else {
			stickyBtn.addEventListener('click', onDelete);
		}
	}
}

function onInput() {
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

function onChangeColor(e) {
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

function onDelete(e) {
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

function saveStickies() {
	stickyArrOld = stickyArr;
	stickyArr = [];
	var sticky = document.querySelectorAll('.sticky');

	for (i = 0; i < sticky.length; i++) {
		stickyCurr = sticky[i];
		stickyArr.push({
			posX: stickyCurr.style.left,
			posY: stickyCurr.style.top,
			stickyColor: stickyCurr.classList[1],
			txt: stickyCurr.firstChild.value,
			txtSize: stickyCurr.firstChild.style.fontSize
		});
	}

	let stickyArrJSON = JSON.stringify(stickyArr);
	localStorage.setItem('stickyArrSave', stickyArrJSON);

	console.clear();
	console.table(stickyArr);
	console.table(stickyArrOld);
	console.log(localStorage.stickyArrSave);
}