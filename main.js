window.onload = onLoad;

syncCheck = setInterval(onSyncCheck, 1000);

var stickyArr;
var stickyArrOld;

btnNew.addEventListener('click', onNewSticky);
btnUndo.addEventListener('click', onUndo);
btnReset.addEventListener('click', onReset);

function getRand(min, max) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function onSyncCheck() {
	let stickyArrJSONLocal = JSON.stringify(stickyArr);
	let stickyArrJSON = localStorage.getItem('stickyArrSave');
	let e = 'e';

	if (stickyArrJSON != stickyArrJSONLocal && localStorage.length != 0) {
		onLoad(e);
	}
	if (stickyArrJSON != 0 && localStorage.length == 0) {
		onLoad(e);
	}
}

function onLoad(e) {
	let stickyArrJSON = localStorage.getItem('stickyArrSave');
	stickyArr = JSON.parse(stickyArrJSON);

	removeStickies();
	if (stickyArr) {
		for (i = 0; i < stickyArr.length; i++) {
			onNewSticky(event, stickyArr[i]);
		}
		saveStickies();
	}
}

function onUndo (e) {
	e.preventDefault();

	removeStickies();
	if (stickyArrOld) {
		for (i = 0; i < stickyArrOld.length; i++) {
			onNewSticky(e, stickyArrOld[i]);
		}
	}
	saveStickies();
}

function onReset(e) {
	e.preventDefault();
	
	stickyArr = [];
	stickyArrOld = [];

	localStorage.clear();
	removeStickies();
}

function stickyNode(node) {
	switch(node) {
		case 'txt':
			let txt = document.createElement('textarea');

			txt.setAttribute('spellcheck', 'false');
			txt.setAttribute('maxlength', '1500');

			txt.addEventListener('input', onInput);
			txt.addEventListener('focusout', saveStickies);

			return txt;
		case 'list':
			let list = document.createElement('ul');
			let listItem = document.createElement('li');

			listItem.setAttribute('contenteditable', 'true')
			listItem.setAttribute('spellcheck', 'false');
			
			listItem.addEventListener('focusout', modifyList)
			list.appendChild(listItem);

			return list;
	}
}

function onNewSticky(e, stickyCurr) {
	if (e) {e.preventDefault()}

	let sticky = document.createElement('div');
	let txt = stickyNode('txt');

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
	addButtons(sticky);
}

function addButtons(sticky) {
	let stickyBtnForm = document.createElement('form');
	let stickyBtnNames = ['Color', 'Switch to List', 'Delete'];

	sticky.appendChild(stickyBtnForm);
	for (j = 0; j < stickyBtnNames.length; j++) {
		let stickyBtn = document.createElement('button');
		stickyBtn.innerHTML = stickyBtnNames[j];
		
		stickyBtnForm.appendChild(stickyBtn);
		switch(stickyBtn.innerHTML) {
			case 'Color':
				stickyBtn.addEventListener('click', onChangeColor);
				break;
			case 'Switch to List':
				stickyBtn.addEventListener('click', onContentChange);
				break;
			case 'Delete':
				stickyBtn.addEventListener('click', onDelete);
				break;
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

function onContentChange(e) {
	e.preventDefault();

	let txt = stickyNode('txt');
	let list = stickyNode('list');
	stickyContent = this.parentNode.parentNode.firstChild;

	switch (stickyContent.nodeName) {
		case txt.nodeName:
			stickyContent.replaceWith(list);
			break;
		case list.nodeName:
			stickyContent.replaceWith(txt);
			break;
	}
}

function onDelete(e) {
	e.preventDefault();

	document.body.removeChild(this.parentNode.parentNode);
	saveStickies();
}

function onStickyHover() {
	let that = this;

	stickyBlur('blur');
	onmouseout = () => {
		stickyBlur('clear');
	}

	document.addEventListener('mousedown', onMouseDown);
	function onMouseDown() {
		if (event.target == that) {
			document.body.appendChild(that);
			document.onmousemove = onMouseMove;
			document.onmouseup = onMouseUp;
		}
	}
	function onMouseMove() {
		that.style.top = event.clientY + 'px';
		that.style.left = event.clientX + 'px';
	}
	function onMouseUp() {
		stickyBlur('clear');
		if (document.onmousemove) {
			saveStickies();
		}
		document.onmousemove = null;
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

function modifyList() {
	listItem = stickyNode('list').firstChild;
	listCurr = this.parentNode;

	if (this.textContent != '' && listCurr.lastChild.textContent != '') {
		listCurr.appendChild(listItem);
	}
	if (!this.textContent && this !== listCurr.lastChild) {
		listCurr.removeChild(this);
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
}

function removeStickies() {
	let stickyOld = document.body.querySelectorAll('.sticky');

	for (i = 0; i < stickyOld.length; i++) {
		document.body.removeChild(stickyOld[i]);
	}
}