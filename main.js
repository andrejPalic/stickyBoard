function getRand(min, max) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}

btnNewSticky.addEventListener('click', onNewSticky);

function onNewSticky() {
	let sticky = document.createElement('div');
	sticky.style.top = getRand(0, 55,5) + '%';
	sticky.style.left = getRand(0, 77.5) + '%';
	sticky.classList.add('sticky', 'stickyColor' + getRand(1, 5));
	document.body.appendChild(sticky);

	let stickyBtnForm = document.createElement('form');
	sticky.appendChild(stickyBtnForm);

	let stickyTxt = document.createElement('textarea');
	stickyTxt.setAttribute('spellcheck', 'false');
	stickyTxt.setAttribute('maxlength', '1500');
	stickyTxt.style.fontSize = 'xx-large';
	sticky.appendChild(stickyTxt);

	let stickyBtn1 = document.createElement('button');
	stickyBtn1.innerHTML = 'Color';
	stickyBtn1.classList.add('stickyBtn');
	stickyBtnForm.appendChild(stickyBtn1);

	let stickyBtn2 = document.createElement('button');
	stickyBtn2.innerHTML = 'Delete';
	stickyBtn2.classList.add('stickyBtn');
	stickyBtnForm.appendChild(stickyBtn2);

	sticky.addEventListener('mouseover', onStickyHover);
	stickyTxt.addEventListener('input', onInput);
	stickyBtn1.addEventListener('click', onChangeColor);
	stickyBtn2.addEventListener('click', onDelete);
}

function onInput() {
	let fontSizeArr = ['xx-small', 'x-small', 'small', 'medium', 'large', 'x-large', 'xx-large'];

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
}

function onDelete(e) {
	e.preventDefault();
	document.body.removeChild(this.parentNode.parentNode);
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