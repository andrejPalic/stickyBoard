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

	stickyNew.addEventListener('mouseover', onStickyHover);
}

function onStickyHover() {
	let that = this;
	let mouseDown;
	stickyBlur('blur')

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
		
		function stickyDrag() {
			that.style.top = event.clientY + 'px';
			that.style.left = event.clientX + 'px';
		}

		function stickyRelease() {
			document.body.appendChild(that);
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