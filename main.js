/* eslint-disable no-console */

async function convertApiResponseToJSON(url) {
   try {
      return await fetch(url).then(data => data.json());
   } catch (error) {
      console.log(error);
   }
}

async function getApiResponse(pageNumber, url = `https://api.hackerwebapp.com/news?page=${pageNumber}`) {
   return await convertApiResponseToJSON(url);
}

// Print the API response
// async function printJsonFromApi() {
//    const promise = await getApiResponse();
//    console.log(promise);
// }
// printJsonFromApi();

async function createHTML(pageNumber) {
   const apiResponse = await getApiResponse(pageNumber);
   const htmlToAppend =
      apiResponse.map(function (apiResponse) {

         const insideHTML = `
         <div class="row ml-md-5 mr-md-5 mb-4 rounded bg-light-grey">
            <div class="order-2 order-md-1 offset-1 offset-md-0 col-10 col-md-3 pt-2 pb-2 text-left">
               <div class="col pl-0">
                  <small><strong>${apiResponse["time_ago"]}</strong></small>
               </div>
               <div class="col pl-0 border-top">
                  <small><strong>${apiResponse["points"]}</strong> ⭐</small>
               </div>
            </div>

            <div class="order-1 order-md-2 offset-1 col-10 col-md-8 pt-2 pb-2">
               <a href=${apiResponse["url"]} class="lead font-weight-bold text-decoration-none txt-white">
                  ${apiResponse["title"]}
               </a>
               <br>

               <!-- <small class="txt-grey"> -->

               <!-- ${apiResponse["comments_count"]} comments <span class="txt-white">//</span>
                  <a href="https://news.ycombinator.com/item?id=${apiResponse["id"]}" class="text-decoration-none txt-grey">https://news.ycombinator.com/item?id=${apiResponse["id"]}</a> -->

               <button class="modal_opener btn btn-link bg-light-grey txt-grey pl-0" id="${apiResponse["id"]}">See ${apiResponse["comments_count"]} Comments</button>

               <!-- </small> -->

            </div>

         </div>
         `

         return insideHTML;
      }).join('');
   return htmlToAppend;
}

async function insertHTML(pageNumber) {
   const html = await createHTML(pageNumber);
   const contentDiv = document.getElementById("content");
   contentDiv.innerHTML = html;
   const modalButtons = Array.from(document.getElementsByClassName("modal_opener"));
   modalButtons.forEach(button => button.addEventListener("click", toggleModal_and_getComments));
}

function changePage() {
   if (this.id == "more-stories") {
      pageNumber += 1;
   }
   else {
      pageNumber -= 1;
   }
   insertHTML(pageNumber);
   updatePageNumber()
   scrolltoListTop()
   hidePreviousStoriesButton();
}

function scrolltoListTop() {
   window.scrollTo(0, 0);
}

function updatePageNumber() {
   const pageNumberText = Array.from(document.getElementsByClassName("page-number"));
   pageNumberText.forEach(number => number.textContent = pageNumber);
}

function hidePreviousStoriesButton() {
   const pageNumber = document.getElementsByClassName("page-number")[0].textContent;
   const previousStoriesButtons = Array.from(document.getElementsByClassName("previous-stories-button"));

   if (pageNumber > 1) {
      previousStoriesButtons.forEach(button => button.classList.remove("d-none"));
   }
   else {
      previousStoriesButtons.forEach(button => button.classList.add("d-none"));
   }
}

document.addEventListener("DOMContentLoaded", function () {
   insertHTML(pageNumber);
})

window.addEventListener("load", function () {
   const moreStoriesButtons = Array.from(document.getElementsByClassName("more-stories-button"));
   moreStoriesButtons.forEach(button => button.classList.remove("d-none"));
   const pageCounters = Array.from(document.getElementsByClassName("page-counter"));
   pageCounters.forEach(button => button.classList.remove("d-none"));
   const footer = document.getElementsByTagName("footer")[0];
   footer.classList.remove("d-none");
})

// Page number state
let pageNumber = 1;

const allButtons = Array.from(document.getElementsByClassName("change-page-button"));
allButtons.forEach(button => button.addEventListener("click", changePage));


// Fetching comments for modals
function toggleModal_and_getComments(event) {
   toggleModal();
   // printJsonFromApi(event)
   insertComments(event);
}
async function getCommentsJSON(event) {
   const id = event.target.id;
   const commentsURL = `https://api.hackerwebapp.com/item/${id}`
   return await convertApiResponseToJSON(commentsURL)
}

async function insertComments(event) {
   const apiCommentsResponse = await getCommentsJSON(event);

   const firstLayerComments = apiCommentsResponse["comments"];

   const htmlToAppend =
      firstLayerComments.map(function (firstLayerComments) {
         const firstLevelUser = `${firstLayerComments["user"]}`;
         const firstLeveltime_ago = `🕔 ${firstLayerComments["time_ago"]}`;
         const firstLevelcommentContent = `${firstLayerComments["content"]}`;

         const secondLayerComments = firstLayerComments["comments"]
         console.log(secondLayerComments)


         const insideHTML = `
         <div class="first-level-comment bg-dark-grey p-2 my-5">
            <p>${firstLevelUser} –– ${firstLeveltime_ago}</p>
            <div class="bg-light-grey p-4">
               ${firstLevelcommentContent}
            </div>
          </div>

         `;
         return insideHTML;
      }).join('');

   const commentsHTML = document.getElementById("commentsMainContent");
   commentsHTML.innerHTML = htmlToAppend;
}

// Print the API response
// async function printJsonFromApi() {
//    const promise = await getCommentsJSON(event);
//    console.log(promise);
// }
// printJsonFromApi();