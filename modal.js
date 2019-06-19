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
	const mainLayerClasses = document.getElementById("main").classList;

	if (currentVisibility.contains("d-none")) {
		currentVisibility.remove("d-none");
		mainLayerClasses.add("position-fixed")
		attachModalListeners();
	}
	else {
		currentVisibility.add("d-none");
		mainLayerClasses.remove("position-fixed")
		detachModalListeners();
	}
}