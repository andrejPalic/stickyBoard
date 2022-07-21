btnNewSticky.addEventListener('click', onNewSticky);

function onNewSticky() {
//console.log('Hi')
	let stickyNew = document.createElement('div');
	stickyNew.classList.add('sticky');
	document.body.appendChild(stickyNew);
}