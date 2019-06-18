function attachModalListeners() {
	document.getElementById("close_modal").addEventListener("click", toggleModal);
	document.getElementById("overlay").addEventListener("click", toggleModal);
}

function detachModalListeners() {
	document.getElementById("close_modal").removeEventListener("click", toggleModal);
	document.getElementById("overlay").removeEventListener("click", toggleModal);
}

function toggleModal() {

	const currentVisibility = document.getElementById("modal").classList;

	if (currentVisibility.contains("d-none")) {
		currentVisibility.remove("d-none");
		attachModalListeners();
		removeModalContent();
	}
	else {
		currentVisibility.add("d-none");
		detachModalListeners();
	}
}

function removeModalContent (){
	const modalContent = document.getElementById("commentsMainContent");
	modalContent.innerHTML = "";
}