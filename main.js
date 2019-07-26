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
   const fullApiResponse = await getApiResponse(pageNumber);
   const htmlToAppend =
      fullApiResponse.map(function (apiResponse) {

         let commentsButton = `<p class="txt-grey py-1 mb-0">No comments</p>`;
         if (apiResponse["comments_count"] > 0) {
            // commentsButton = `<button class="modal_opener btn btn-link bg-light-grey txt-white pl-0" id="${apiResponse["id"]}">See ${apiResponse["comments_count"]} Comments</button>`;
         
         
         commentsButton = `<a class="word-wrap btn btn-link bg-light-grey txt-white pl-0" id="${apiResponse["id"]}" href="https://news.ycombinator.com/item?id=${apiResponse["id"]}">See ${apiResponse["comments_count"]} Comments</a>`;
         }

         let score = `0`;

         if (apiResponse["points"] > 0) {
            score = apiResponse["points"];
         }

         const insideHTML = `
         <div class="row ml-md-5 mr-md-5 mb-4 rounded bg-light-grey">
            <div class="order-2 order-md-1 offset-1 offset-md-0 col-10 col-md-3 pt-2 pb-2 text-left">
               <div class="col pl-0 pb-2">
                  <a href="https://news.ycombinator.com/item?id=${apiResponse["id"]}" class="txt-white"><small><strong>${apiResponse["time_ago"]}</strong></small></a>
               </div>
               <div class="col pl-0 pt-2 border-top">
                  <small><strong>${score}</strong> ⭐</small>
               </div>
            </div>

            <div class="order-1 order-md-2 offset-1 col-10 col-md-8 pt-2 pb-2">
               <a href=${apiResponse["url"]} class="lead font-weight-bold text-decoration-none word-wrap txt-white">
                  ${apiResponse["title"]}
               </a>
               <br>

               <small>
                  <a href="${apiResponse["url"]}" class="txt-grey word-wrap">${apiResponse["url"]}</a>
               </small>
               <br>

             <div class="mt-2">
                  ${commentsButton}
               </div> 

            </div>

         </div>
         `;

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
   insertComments(event);
}
async function getCommentsJSON(event) {
   const id = event.target.id;
   const commentsURL = `https://api.hackerwebapp.com/item/${id}`
   return await convertApiResponseToJSON(commentsURL)
}

async function insertComments(event) {
   const apiResponse = await getCommentsJSON(event);

   const currentCommentLevel = 0
   function findAllComments() {
      if (apiResponse["comments"]) {
         const commentsObject = apiResponse["comments"];
      }
   }


   const allText = commentsObject.map(function (commentObject) {
      // console.log(commentObject)

      const user = `${commentObject["user"]}`;
      const time_ago = `🕔 ${commentObject["time_ago"]}`;
      const commentContent = `${commentObject["content"]}`;
      const level = `${commentObject["level"]}`;

      // console.log(commentObject["comments"].length)

      if (commentObject["comments"].length > 0) {
         const lowerComments = commentObject["comments"].map(function (lowerComment) {
            console.log(lowerComment);
            // return lowerComments;
         }).join(" ");
      }


      const allText = `
      <div class="bg-dark-grey p-2 my-5 level-${level}">
         <p>${user} –– ${time_ago}</p>
         <div class="bg-light-grey p-4">
            ${commentContent}
         </div>
       </div>
      `
      return allText;
   }).join(" ");

   const commentsHTML = document.getElementById("commentsMainContent");
   commentsHTML.innerHTML = allText;
}


// Print the API response
// async function printJsonFromApi() {
//    const promise = await getCommentsJSON(event);
//    console.log(promise);
// }
// printJsonFromApi();
