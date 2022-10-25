console.log("background js");
// import { getAudio } from "./audio";

// Called when the user clicks on the action.
chrome.action.onClicked.addListener(function (tab) {
  // No tabs or host permissions needed!
  console.log("Turning " + tab.url + " red!");
  chrome.scripting.executeScript({
    code: 'document.body.style.backgroundColor="red"',
  });
});
var urlObj = {};
// urlObj.url = tab.url;
// urlObj.title = tab.title

// postData("http://localhost:3000", {  urlObj }).then((data) => {
//   console.log(data)
// });


async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}



async function printtab() {
  const tabInfo = await getCurrentTab();
  console.log(tabInfo);
}
printtab();

async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response; // parses JSON response into native JavaScript objects
}
