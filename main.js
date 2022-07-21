function getRand(min, max) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}

btnNewSticky.addEventListener('click', onNewSticky);

function onNewSticky() {
	//console.log(getRand(1, 3))
	let stickyNew = document.createElement('div');
	stickyNew.classList.add('sticky');
	document.body.appendChild(stickyNew);
}