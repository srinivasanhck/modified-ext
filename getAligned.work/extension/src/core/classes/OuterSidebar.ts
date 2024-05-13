import IframeBase from "../bases/IframeBase";
import { APP_URL, MODE, TESTING_URL } from "../../../../shared/config";

export default class OuterSideBar extends IframeBase {
  url = APP_URL + "/outer-sidebar";
  name = "extension-outersidebar";
  style_source = chrome.runtime.getURL("/css/outer-sidebar/style.css");
  opened = false;
  draggable = false;

  handle_outer_sidebar_close() {
    // console.log("came here to .ts")
    // this.iframe_container.style.width = "0px";
    this.iframe_container.classList.remove("active");
  }

  async handle_catchuplater_from_outer_sidebar() {
    console.log("invokkeddd");
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

    function formatCustomDate() {
      // Get the current date and time
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1; // JavaScript months are 0-indexed
      const formattedMonth = month < 10 ? `0${month}` : month;
      const day = now.getDate();
      const formattedDay = day < 10 ? `0${day}` : day;
      const hour = now.getHours();
      const formattedHour = hour < 10 ? `0${hour}` : hour;
      const minute = now.getMinutes();
      const formattedMinute = minute < 10 ? `0${minute}` : minute;

      // Format the date and time
      const formattedDate = `${year}-${formattedMonth}-${formattedDay}T${formattedHour}:${formattedMinute}:00`;
      console.log(formattedDate);
      return formattedDate;
    }

    try {
      let messageId: any;
      //to get message id elemnt from gmail ui
      const targetElement = document.querySelector('div.adn.ads');
      if (targetElement) {
        console.log("Found the target element:", targetElement);
        messageId = targetElement.getAttribute('data-legacy-message-id');

        if (messageId) {
          const formattedDate = formatCustomDate();
          console.log("Legacy message id", messageId);
          const response = await fetch(`${TESTING_URL}/api/v1/emails/catch-up-later-emails`, {
            method: "POST",
            body: JSON.stringify({ standardEmailId: messageId, createdDate: formattedDate }),
            headers: {
              'Content-Type': 'application/json',
              "Authorization": `Bearer ${await getAccessToken()}`
            }
          })
          const data = await response.json();
          console.log("data at CIBB", data);

          chrome.runtime.sendMessage({ type: "applyLabel", messageId: messageId });

          return { standardEmailId: messageId }
        }
      }
      else {
        console.log("Target element not found.");
      }
    }
    catch (error) {
      console.log("error at paramValue", error)
    }
  }

  async handle_remove_catchuplayer_from_outer_sidebar() {
    console.log("app_url",APP_URL);
    console.log("MODE", MODE);
  
    try {
      let messageId: any;
      //to get message id elemnt from gmail ui
      const targetElement = document.querySelector('div.adn.ads');
      if (targetElement) {
        console.log("Found the target element:", targetElement);
        messageId = targetElement.getAttribute('data-legacy-message-id');
        let urlIncludesCatchup=false;
        if(window.location.hash.includes("#label/catchup")){
          urlIncludesCatchup = true;
        }
        console.log("mmmmmmm", messageId, urlIncludesCatchup);
        if (messageId) {
          return { messageId, urlIncludesCatchup };
        }
        else {
          return { messageId: false }
        }
      }
    }
    catch (err) {
      return {
        error: err
      }
    }
  }

  handle_openCatchupTab() {
    console.log("openCatchupTab recieved at extension");
    window.location.hash = "#label/catchup";
  }

  handle_open_particular_mail(mailUrl: any) {
    // Find the span element containing the message ID
    console.log("openParticularMail recieved", mailUrl);
    window.location.href = mailUrl;
    // window.history.pushState({}, '', mailUrl);
  }


  handle_outer_sidebar_open() {
    // console.log("sidebar width",`${this.width}`)
    this.iframe_container.style.width = `${this.width}px`;
  }

  async handle_outerSidebar_iframe_ready() {
    // console.log("habdle sidebar ifram ready executed in sidebar")
    this.iframe_is_ready = true;
    this.iframe_el.classList.add("extension-iframe-ready");

    this._iframe_ready_resolver();
    this._iframe_ready_resolver = null;

    this.handle_popup_ready();

    return {
      accessToken: await chrome.storage.sync.get("accessToken")
    }
  }

  handle_popup_ready() { }
}
