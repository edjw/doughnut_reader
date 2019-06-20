function escapeModal() {
	const currentVisibility = document.getElementById("modal").classList;
	document.addEventListener("keydown", function (e) {
		if (e.key === "Escape" && currentVisibility.contains("d-none") == false {
			toggleModal();
		}
	})
}

function attachModalListeners() {
	document.getElementById("close_modal").addEventListener("click", toggleModal);
	document.getElementById("overlay").addEventListener("click", toggleModal);
	escapeModal();
}

function detachModalListeners() {
	document.getElementById("close_modal").removeEventListener("click", toggleModal);
	document.getElementById("overlay").removeEventListener("click", toggleModal);
}

function removeModalContent() {
	const modalContent = document.getElementById("commentsMainContent");
	modalContent.innerHTML = "";
}

function toggleModal() {

	const currentVisibility = document.getElementById("modal").classList;
	const mainLayerClasses = document.getElementById("main").classList;

	if (currentVisibility.contains("d-none")) {
		currentVisibility.remove("d-none");
		mainLayerClasses.add("position-fixed")
		attachModalListeners();
		removeModalContent();
	}
	else {
		currentVisibility.add("d-none");
		mainLayerClasses.remove("position-fixed")
		detachModalListeners();
	}
}