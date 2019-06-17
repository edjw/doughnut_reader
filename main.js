/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
   MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
   funcTag = '[object Function]',
   genTag = '[object GeneratorFunction]';

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
   var index = -1,
      length = values.length,
      offset = array.length;

   while (++index < length) {
      array[offset + index] = values[index];
   }
   return array;
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var Symbol = root.Symbol,
   propertyIsEnumerable = objectProto.propertyIsEnumerable,
   spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
   var index = -1,
      length = array.length;

   predicate || (predicate = isFlattenable);
   result || (result = []);

   while (++index < length) {
      var value = array[index];
      if (depth > 0 && predicate(value)) {
         if (depth > 1) {
            // Recursively flatten arrays (susceptible to call stack limits).
            baseFlatten(value, depth - 1, predicate, isStrict, result);
         } else {
            arrayPush(result, value);
         }
      } else if (!isStrict) {
         result[result.length] = value;
      }
   }
   return result;
}

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
   return isArray(value) || isArguments(value) ||
      !!(spreadableSymbol && value && value[spreadableSymbol]);
}

/**
 * Recursively flattens `array`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flattenDeep([1, [2, [3, [4]], 5]]);
 * // => [1, 2, 3, 4, 5]
 */
function flattenDeep(array) {
   var length = array ? array.length : 0;
   return length ? baseFlatten(array, INFINITY) : [];
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
   // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
   return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
      (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
   return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
   return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
   // The use of `Object#toString` avoids issues with the `typeof` operator
   // in Safari 8-9 which returns 'object' for typed array and other constructors.
   var tag = isObject(value) ? objectToString.call(value) : '';
   return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
   return typeof value == 'number' &&
      value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
   var type = typeof value;
   return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
   return !!value && typeof value == 'object';
}

// module.exports = flattenDeep;



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
   const apiResponse = await getCommentsJSON(event);
   const title = apiResponse["title"];
   const url = apiResponse["url"];
   // const commentCount = apiResponse["comments_count"];
   const commentsObject = apiResponse["comments"];
   let topLevelComments = "";

   commentsObject.forEach(function (comment) {
      const user = `${comment["user"]}`;
      const time_ago = `🕔 ${comment["time_ago"]}`;
      const commentContent = `${comment["content"]}`;
      const allText = `
      <div class="bg-dark-grey p-2 my-5">
         <p>${user} –– ${time_ago}</p>
         <div class="bg-light-grey p-4">
            ${commentContent}
         </div>
       </div>
      `;
      topLevelComments += allText;
   })

   // const titleHTML = document.getElementById("titleComments");
   // titleHTML.innerText = title;
   // titleHTML.setAttribute("href", url)

   // const commentsCountHTML = document.getElementById("commentsCount");
   // commentsCountHTML.innerText = `${commentCount} comments`;

   const commentsHTML = document.getElementById("commentsMainContent");
   commentsHTML.innerHTML = topLevelComments;
}


// Print the API response
// async function printJsonFromApi() {
//    const promise = await getCommentsJSON(event);
//    console.log(promise);
// }
// printJsonFromApi();