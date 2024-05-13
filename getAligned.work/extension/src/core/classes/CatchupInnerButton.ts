import { TESTING_URL } from "../../../../shared/config";
import Component from "../bases/Component";

export default class CatchupInnerButton extends Component {
  component_class_selector = "catchup-innerbutton-root-div";

  mounted() {
    console.log("catchupbtnn mounted");
    this.component_el.addEventListener("click", async (event: MouseEvent) => {
      console.log("button clicked");

      const buttonDiv = this.component_el.querySelector('.catchup-innerbutton-root-div') as HTMLElement;
      if (buttonDiv) {
        console.log("butttovdiv")
        buttonDiv.style.pointerEvents = 'none';
      }

      //add loader
      // const loader = this.component_el.querySelector('.loader') as HTMLElement;
      // if (loader) {
      //   loader.style.display = 'block';
      // }


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

      // try {
      //   let messageId;
      //   //to get message id elemnt from gmail ui
      //   const targetElement = document.querySelector('div.adn.ads');
      //   if (targetElement) {
      //     console.log("Found the target element:", targetElement);
      //     messageId = targetElement.getAttribute('data-legacy-message-id');
      //     if (messageId) {
      //       console.log("Legacy message id", messageId);
      //       const response = await fetch(`${TESTING_URL}/api/v1/emails/catch-up-later-emails`, {
      //         method: "POST",
      //         body: JSON.stringify({ standardEmailId: messageId }),
      //         headers: {
      //           'Content-Type': 'application/json',
      //           "Authorization": `Bearer ${await getAccessToken()}`
      //         }
      //       })
      //       const data = await response.json();
      //       console.log("data at CIB", data);
      //       chrome.runtime.sendMessage({ type: "applyLabel", messageId: messageId });
      //       // chrome.runtime.sendMessage({action:"appliedLabel",eventName:"appliedLabel"})
      //       if (buttonDiv) {
      //         buttonDiv.style.pointerEvents = 'auto';
      //       }
      //       if (loader) {
      //         //stop loader
      //         loader.style.display = 'none';
      //       }
      //     }
      //   }
      //   else {
      //     console.log("Target element not found.");
      //   }
      // }
      // catch (error) {
      //   console.log("error at paramValue", error)
      //   if (loader) {
      //     //stop loader
      //     loader.style.display = 'none';
      //   }
      // }
    })
  }




  template() {
    return /*html*/ `
    <button class="catchup-innerbutton-root" title="Add to catchup">
      <span class="catchup-innerbutton-root__icon">
        <img src="${chrome.runtime.getURL("assets/catchup.svg")}" style={{marginTop:"4px"}} alt="catchup innerbutton">
      </span>
      <p>Catch up later</p>
      <div class="loader"></div>
    </button>
    

    <!-- Style -->
    <style>
    .catchup-innerbutton-root-div{
        height:32px !important;
        width:146px;
        display:flex;
        justify-content: center;
        align-items: center;
        background: #E37400;
        border-radius:5px;
        margin-right:25px;
        transition: box-shadow 0.3s ease;
        box-shadow:0 12px 25px rgba(0,0,0,0.25);
      }

      .catchup-innerbutton-root:hover,
      .catchup-innerbutton-root-div:hover {
        background-color: #E37400;
        box-shadow:0 20px 25px rgba(0,0,0,0.25);
        }
      
      p{
        margin-left:8px;
        font-size:14px;
        color:white;
      }
      .catchup-innerbutton-root {
        cursor: pointer;
        display: flex;
        align-items: center;
        width:135px;
        height:27px;
        border:none;
        transition-duration: 200ms;
        background-color:#E37400;
      }
     
      .catchup-innerbutton-root__icon {
      }

      .loader {
        display: none;
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-top: 4px solid #3498db;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        animation: spin 1s linear infinite;
        position: absolute;
       right:9%;
        transform: translate(-50%, -50%);
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
  }
}