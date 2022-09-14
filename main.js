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
	stickyBtn1.innerHTML = 'Test 1';
	stickyBtn1.classList.add('stickyBtn');
	stickyBtnForm.appendChild(stickyBtn1);
	

	let stickyBtn2 = document.createElement('button');
	stickyBtn2.innerHTML = 'Test 2';
	stickyBtn2.classList.add('stickyBtn');
	stickyBtnForm.appendChild(stickyBtn2);

	stickyNew.addEventListener('mouseover', onStickyHover);
	stickyBtn1.addEventListener('click', onTest1);
	stickyBtn2.addEventListener('click', onTest2);
}

function onTest1(e) {
	e.preventDefault();
	console.log('Test 1')
}

function onTest2(e) {
	e.preventDefault();
	console.log('Test 2')
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
		
		function stickyDrag() {
			that.style.top = event.clientY + 'px';
			that.style.left = event.clientX + 'px';
		}

		function stickyRelease() {
			mouseDown = false;
			stickyBlur('clear');
			document.onmousemove = null;

			if (event.target === that) {
				document.body.appendChild(that);
			}
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