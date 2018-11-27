async function getJSON(url) {
   try {
      return await fetch(url).then(data => data.json());
   } catch (error) {
      console.log(error);
   }
}

async function getTopHnIDs() {
   const url = "https://hacker-news.firebaseio.com/v0/topstories.json";

   // For testing
   // const url = "for_testing_topstories.json";

   return await getJSON(url);
}

async function getStoryDetails(firstRequestedItemIndex, lastRequestedItemIndex) {
   const topStories = await getTopHnIDs();
   const allStoryDetails = [];
   for (let storyID of topStories) {
      const currentIndex = topStories.indexOf(storyID);

      if (currentIndex == lastRequestedItemIndex) {
         break
      } else if (currentIndex >= firstRequestedItemIndex) {
         const storyEndpoint = `https://hacker-news.firebaseio.com/v0/item/${storyID}.json`
         const storyDetails = await getJSON(storyEndpoint);
         allStoryDetails.push(storyDetails);
      }
   }
   return allStoryDetails;

}
async function displayStories(firstRequestedItemIndex, lastRequestedItemIndex) {

   const previousStoriesButton = document.getElementById("previous-stories");
   // const moreStoriesButton = document.getElementById("more-stories");
   const pageCounter = document.getElementById("page-counter");
   pageCounter.classList.remove("d-none");

   if (firstRequestedItemIndex == 0) {
      pageCounter.classList.add("d-none");
      previousStoriesButton.classList.add("d-none");
   } else if (firstRequestedItemIndex >= 10) {
      const pageNumber = (firstRequestedItemIndex / 10) + 1;
      pageCounter.innerText = `${pageNumber} of 50`;
      previousStoriesButton.classList.remove("d-none");
   }

   const storyDetails = await getStoryDetails(firstRequestedItemIndex, lastRequestedItemIndex);

   const htmlContainer = document.getElementById("content");

   let htmlToInsert = "";

   const now = Date.now();
   for (let story of storyDetails) {

      const date = story.time * 1000;
      const roughHoursAgo = Math.round((now - date) / 3600000);
      let timeStamp = "";
      if (roughHoursAgo >= 24) {
         const daysAgo = Math.round(roughHoursAgo / 24);
         if (daysAgo > 1) {
            timeStamp += `${daysAgo} days`
         } else if (daysAgo == 1) {
            timeStamp += `${daysAgo} day`
         }
      } else if (roughHoursAgo > 1 && roughHoursAgo < 24) {
         timeStamp += `${roughHoursAgo} hrs`;
      } else if (roughHoursAgo <= 1) {
         timeStamp += `${roughHoursAgo} hr`;
      }

      let numberOfComments = 0;
      if (story.kids) {
         numberOfComments = story.kids.length;
      }

      let score = 0;
      if (story.score) {
         score = story.score;
      }
      htmlToInsert += `

		<div class="row ml-md-5 mr-md-5 mb-4 rounded bg-light">
			<div class="order-2 order-md-1 offset-1 col-10 offset-md-1 col-md-2 pt-2 pb-2 text-left">
				<div class="col pl-0">
					<small><strong>${timeStamp} ago</strong></small>
				</div>
				<div class="col pl-0 border-top">
					<small><strong>${score}</strong> ⭐</small>
				</div>
			</div>

			<div class="order-1 order-md-2 offset-1 col-10 col-md-8 pt-2 pb-2">
				<a href=${story.url} class="lead font-weight-bold text-decoration-none story-title">
					${story.title}
				</a>
				<br>
				<small>
            ${numberOfComments} comments // <a href="https://news.ycombinator.com/item?id=${story.id}" class="text-decoration-none story-comments">https://news.ycombinator.com/item?id=${story.id}</a>
				</small>
			</div>
		</div>

  	  `;

   }
   htmlContainer.innerHTML = htmlToInsert;
   htmlContainer.classList.remove("d-none");
   const moreStoryButtons = document.getElementById("more-stories");
   moreStoryButtons.classList.remove("d-none");
}

document.addEventListener("DOMContentLoaded", function () {

   let firstRequestedItemIndex = 0;
   let lastRequestedItemIndex = 10;

   displayStories(firstRequestedItemIndex, lastRequestedItemIndex);

   const moreStoriesButton = document.getElementById("more-stories");
   const previousStoriesButton = document.getElementById("previous-stories");

   moreStoriesButton.addEventListener("click", function () {
      getDifferentStories(firstRequestedItemIndex, lastRequestedItemIndex, button = moreStoriesButton);
   })

   previousStoriesButton.addEventListener("click", function () {
      getDifferentStories(firstRequestedItemIndex, lastRequestedItemIndex, button = previousStoriesButton);
   })

   function getDifferentStories() {
      const htmlContainer = document.getElementById("content");
      window.scrollTo(0, htmlContainer.offsetParent.offsetTop - 20);

      htmlContainer.classList.add("d-none");

      if (button.id == "more-stories") {
         firstRequestedItemIndex += 10;
         lastRequestedItemIndex += 10;
         displayStories(firstRequestedItemIndex, lastRequestedItemIndex);

      } else if (button.id == "previous-stories") {
         firstRequestedItemIndex -= 10;
         lastRequestedItemIndex -= 10;

         displayStories(firstRequestedItemIndex, lastRequestedItemIndex);
      }
   }


});
// async function printPromise() {
//    const promise = await //getTopHNIDs();
//    console.log(promise);
// }

// printPromise();