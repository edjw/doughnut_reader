function escapeModal() {
	const currentModalVisibility = document.getElementById("modal").classList;
	document.addEventListener("keydown", function (event) {
		if (event.key === "Escape" && currentModalVisibility.contains("d-none") == false) {
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
	const modalContent = document.getElementById("fullTextContentContainer");
	modalContent.innerHTML = "";
}

function saveStartingScrollHeight() {
	const startingScrollHeight = window.pageYOffset;
	const main = document.getElementById("main");
	main.dataset.scrollHeight = startingScrollHeight;
}

function revertToStartingScrollHeight() {
	const main = document.getElementById("main");
	const startingScrollHeight = main.dataset.scrollHeight;
	window.scrollTo(0, startingScrollHeight);
	delete main.dataset.scrollHeight;
}


function toggleModal() {
	const currentModalVisibility = document.getElementById("modal").classList;
	const mainLayerClasses = document.getElementById("main").classList;

	if (currentModalVisibility.contains("d-none")) {
		saveStartingScrollHeight();
		currentModalVisibility.remove("d-none");
		mainLayerClasses.add("position-fixed")
		currentModalVisibility.add("open");
		attachModalListeners();
		removeModalContent();
	}
	else {
		revertToStartingScrollHeight();
		currentModalVisibility.add("d-none");
		currentModalVisibility.remove("open");
		mainLayerClasses.remove("position-fixed")
		detachModalListeners();
	}
}