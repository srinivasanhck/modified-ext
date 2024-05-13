import ContentController from "../core/controllers/ContentController";
import Util from "../core/util/Util";

//getting token from application window (home.jsx)
window.addEventListener("message", async (event) => {
  if(event.data.type=="authSuccess"){
    console.log("eventt",event.data);
    chrome.runtime.sendMessage({ type: 'accessToken', accessToken: event.data.accessToken });
    console.log("authSuccess in extc",event.data.accessToken);
  }
});


async function getAccessToken() {
  // Retrieve token from storage
  const token = await new Promise<string>((resolve) => {
    chrome.storage.sync.get("accessToken", (data) => {
      console.log("Access token in getc", data.accessToken);
      resolve(data.accessToken);
    });
  });
  return token;
}

chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
if(message.action=="showToast"){
  // sendAnalyticsEvent(message.eventName, message.eventParams);
  const toast=document.querySelector(".extension-toast");
  const toastInner = document.querySelector(".extension-toast p");
  console.log("toast",toast);
  if(toast){
            // removeCatchUpButton(message.messageId);
    toastInner.innerHTML="Added to catchup later";
    toast.classList.add("active");
    setTimeout(()=>{
      toast.classList.remove("active");
    },3000)
  }
}
else if(message.action=="showToastAdded"){
  // sendAnalyticsEvent(message.eventName, message.eventParams);
  const toast=document.querySelector(".extension-toast");
  const toastInner = document.querySelector(".extension-toast p");
  console.log("toast",toast);
  if(toast){
    toastInner.innerHTML="Already added to catchup";
    toast.classList.add("active");
    setTimeout(()=>{
      toast.classList.remove("active");
    },3000)
  }
}
})

function bootstrap() {
  const content = new ContentController();
  content.init();
  Util.create_window_api(content);
  return content;
}


async function checkAuthenticationAndBootstrap() {
  const accessToken = await getAccessToken();
  console.log("ckecking for token in cont script initially", accessToken);
  if (accessToken) {
    const instance = bootstrap();
    }
  }
  
  // flow starts from here checks for access token initially if present call bootstrap() or else no
  checkAuthenticationAndBootstrap();

  