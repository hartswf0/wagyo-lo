import { saveData } from "./firebase.js";

const sendBtn = document.getElementById("send-btn");
const reviseBtn = document.getElementById("revise-btn");
const positiveRatingButton = document.querySelector("#positive-rating");

let apireturn;
let userPrompt = "";
let entityEl;
let entityContents;
let includes_scene = false;
let includes_entity = false;
let iteration = 0;
let previous_prompt;
let previous_prompt_result;
let revise_bool = false;

// Prompt button functionality
sendBtn.addEventListener("click", function (event) {
  // Prevent the default form submission behavior
  event.preventDefault();

  document.getElementById("Bricks").play();

  userPrompt = document.querySelector('input[name="user_prompt"]').value;
  revise_bool = false;
  previous_prompt = userPrompt;

  // Send an Ajax request to the server
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/", true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.onload = function () {
    if (xhr.status === 200) {
      // Update the HTML content with the response from the server
      var response = JSON.parse(xhr.responseText);
      // console.log(response.result);
      apireturn = response.result;  

      // Offload specifics of response handling
      handleResponse(response.result, revise_bool);
    } else {
      console.error("Request failed. Returned status of " + xhr.status);
    }
  };
  xhr.send(
    JSON.stringify({
      user_prompt: document.getElementById("user_prompt").value,
      revise_bool: revise_bool,
    })
  );

  sendBtn.innerText = "Loading...";
  sendBtn.style.backgroundColor = "#5cc68d";
  // sendBtn.style.animation = 'color-transition 4s infinite;'
  // Hide Revision fields while API is being called
  hideRevise();
  // Refresh the Rate button
  refreshRateButton();
});

reviseBtn.addEventListener("click", (event) => {
  // handle click event for Revise button
  event.preventDefault();

  const revisePrompt = document.querySelector(
    'input[name="revise_prompt"]'
  ).value;
  // console.log("Revise prompt:", revisePrompt);

  userPrompt = document.querySelector('input[name="revise_prompt"]').value;
  revise_bool = true;

  document.getElementById("Bricks").play();

  // Send an Ajax request to the server
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/", true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.onload = function () {
    if (xhr.status === 200) {
      // Update the HTML content with the response from the server
      var response = JSON.parse(xhr.responseText);
      // console.log(response.result);

      // Offload specifics of response handling
      handleResponse(response.result, revise_bool);
    } else {
      console.error("Request failed. Returned status of " + xhr.status);
    }
  };
  // Call your API function and pass the shape string as a parameter
  xhr.send(
    JSON.stringify({
      user_prompt: document.getElementById("revise_prompt").value,
      revise_bool: revise_bool,
      previous_prompt: previous_prompt_result,
      includes_scene: includes_scene,
    })
  );

  reviseBtn.innerText = "Loading...";
  reviseBtn.style.backgroundColor = "#5cc68d";

  // Refresh the Rate button
  refreshRateButton();
});

positiveRatingButton.addEventListener("click", (event) => {
  // handle click event for Revise button
  event.preventDefault();
  const previous_iteration = iteration - 1;
  const tagValue = positiveRatingButton.dataset.tag;

  // Handle toggle of favoriting
  if (tagValue == 0) {
    saveData(userPrompt, apireturn, previous_iteration, true);
    rateButton();
  } else {
    saveData(userPrompt, apireturn, previous_iteration, false);
    refreshRateButton();
  }
});

// Handle what to do with the return from API

// Need to handle if coming from revision or if coming from prompt
function handleResponse(apireturn, revise_bool) {
  try {
    const tempDiv = document.createElement("div");

    const pattern_scene = /<a-scene>\n(.*)<\/a-scene>/s;
    const match_scene = apireturn.match(pattern_scene);
    
    // console.log(revise_bool);

    if (match_scene) {
      const code = "<a-scene>\n" + match_scene[1] + "</a-scene>";
      // console.log("matches scene",code);
      tempDiv.innerHTML = code;
    } else {
      const pattern_entity = /<a-entity>\n(.*)<\/a-entity>/s;
      const match_scene = apireturn.match(pattern_entity);
      // console.log("No match found.");
      if (match_scene) {
        const code = "<a-entity>\n" + match_scene[1] + "</a-entity>";
        // console.log(code);
        tempDiv.innerHTML = code;
      } else {
        tempDiv.innerHTML = apireturn;
      }
    }

    const scenetag = tempDiv.querySelector("a-scene");
    const entitytag = tempDiv.querySelector("a-entity");

    // console.log(tempDiv.innerHTML);

    if (!scenetag) {
      entityEl = tempDiv.querySelector("a-entity");
      entityContents = entityEl.innerHTML;
      includes_scene = false;
    } else {
      entityEl = tempDiv.querySelector("a-scene");

      entityContents = entityEl.innerHTML;
      includes_scene = false;
    }

    // console.log(entityContents);
    // Save the previous prompt in case its needed
    previous_prompt_result = entityContents;

    var scene = document.querySelector("a-scene");

    // This only works to clean the last object whatever it is
    if (revise_bool) {
      // console.log("this request is a revision");
      const myEntity = document.querySelector("#new-object");
      const parentEntity = myEntity.parentNode;
      parentEntity.removeChild(myEntity);
      saveData(previous_prompt,apireturn, iteration, false, true, userPrompt);
    } else {
      saveData(userPrompt,apireturn, iteration);
    }
    // -------

    // Add new entity
    var pyramid = document.createElement("a-entity");
    pyramid.setAttribute("id", "new-object");

    // Append each child element of the temporary div to the scene
    while (entityEl.firstChild) {
      pyramid.appendChild(entityEl.firstChild);
    }

    scene.appendChild(pyramid);

    // Hide the loading bar after the API call is complete
    sendBtn.innerText = "Send!";
    sendBtn.style.backgroundColor = "#2b8b57";
    reviseBtn.innerText = "Revise!";
    reviseBtn.style.backgroundColor = "#2b8b57";

    document.getElementById("myAudio").play();

    // Display Revision fields
    showRevise();

    // Increase iteration for recording user sessions
    iteration += 1;

    // console.log("completed the api request and return");
  } catch (err) {
    console.error(err);

    document.getElementById("Error").play();
  }
}

function showRevise() {
  const revise_group = document.querySelector("#revise-group");
  const revise_button = document.querySelector("#revise-btn");

  revise_group.style.display = "block";
  revise_button.style.display = "block";
}

function hideRevise() {
  const revise_group = document.querySelector("#revise-group");
  const revise_button = document.querySelector("#revise-btn");

  revise_group.style.display = "none";
  revise_button.style.display = "none";
}

function rateButton() {
  const positiveRatingButton = document.querySelector("#positive-rating");

  // Perform the desired action when the positive rating button is clicked
  positiveRatingButton.innerText = "Thanks! 🌟";
  positiveRatingButton.style.color = "#ffffff";
  positiveRatingButton.style.backgroundColor = "#86b8c1";
  positiveRatingButton.dataset.tag = 1;
}

export function refreshRateButton() {
  const positiveRatingButton = document.querySelector("#positive-rating");

  // Perform the desired action when the positive rating button is clicked
  positiveRatingButton.innerText = "Like this build? 👍";
  positiveRatingButton.style.color = "#333333";
  positiveRatingButton.style.backgroundColor = "rgba(255,255,255,0.8)";
  positiveRatingButton.dataset.tag = 0;
}
