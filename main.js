function getRand(min, max) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}

btnNewSticky.addEventListener('click', onNewSticky);

function onNewSticky() {
	let stickyNew = document.createElement('div');
	stickyNew.style.top = getRand(0, 55,5) + '%';
	stickyNew.style.left = getRand(0, 77.5) + '%';
	stickyNew.classList.add('sticky', 'stickyColor' + getRand(1, 5));
	document.body.appendChild(stickyNew);

	let stickyBtnForm = document.createElement('form');
	stickyNew.appendChild(stickyBtnForm);

	let stickyBtn1 = document.createElement('button');
	stickyBtn1.innerHTML = 'Color';
	stickyBtn1.classList.add('stickyBtn');
	stickyBtnForm.appendChild(stickyBtn1);

	let stickyBtn2 = document.createElement('button');
	stickyBtn2.innerHTML = 'Delete';
	stickyBtn2.classList.add('stickyBtn');
	stickyBtnForm.appendChild(stickyBtn2);

	stickyNew.addEventListener('mouseover', onStickyHover);
	stickyBtn1.addEventListener('click', onChangeColor);
	stickyBtn2.addEventListener('click', onDelete);
}

function onChangeColor(e) {
	e.preventDefault();
	let stickyCurrent = this.parentNode.parentNode;
	let oldColorId = parseInt(stickyCurrent.classList[1][11]);
	let newColorId = oldColorId + 1;
	if (newColorId > 5) {
		newColorId = 1;
	}
	stickyCurrent.classList.remove('stickyColor' + oldColorId);
	stickyCurrent.classList.add('stickyColor' + newColorId);
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
		document.onmousemove = stickyDrag;

					if (event.target === that) {
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