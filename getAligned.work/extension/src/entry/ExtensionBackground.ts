import Util from "../core/util/Util";
import { APP_URL, TESTING_URL } from "../../../shared/config";

async function getAccessToken() {   // Function to retrieve access token
  console.log("getAccessToken() called");
  // Retrieve token from storage
  const token = await new Promise((resolve) => {
    chrome.storage.sync.get("accessToken", (data) => {
      console.log("Access token in get");
      resolve(data.accessToken);
    });
  });
  if (token) {
    return token; 
  } 
  else {
    return null;
  }
}

// Function to store access token
function storeAccessToken(token: any) {
  chrome.storage.sync.set({ accessToken: token }, () => {
    console.log("Access token stored successfully", token);
  });
}



chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  // Listener for messages from OAuth consent page
  console.log("Request type:", request.type);
   if (request.type === "accessToken") {
    console.log("Received access token in bg:", request.accessToken);
    storeAccessToken(request.accessToken);
  }
});


// Entry point: Check if label exists after authentication
chrome.runtime.onInstalled.addListener(async () => {
  console.log("Entered/listened on install");
  // chrome.tabs.create({ url: "http://localhost:5174/" });
  chrome.tabs.create({ url: "https://extension.getaligned.work" });
});


async function main() {

  console.log("start")
  chrome.action.onClicked.addListener(async (tab) => {
    console.log("start1");
    const tab_url = new URL(tab.url);
    let current_tab: any = null;

    const tabs_other = await chrome.tabs.query({
      active: false,
    });
    for (let tab of tabs_other) {
      await Util.runtime_send_message(tab.id, {
        action: "iframe-destroy",
        data: null,
      });
    }

    if (!current_tab) {
      [current_tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });
    }
    // Sends a "click-action" message to the active tab's content script, initiating actions there.
    await Util.runtime_send_message(current_tab.id, {
      action: "click-action",
      data: null,
    });
  });
}

main();

