//@ts-nocheck
import util from "../util/Util";
import CatchupButton from "../classes/CatchupButton";
import OuterSideBar from "../classes/OuterSidebar";

export default class GmailIntegration {
  // Bases
  name = "gmail";
  loaded_selector = "body";

  init() {
    window.addEventListener("load", () => {
      const catchupButton: HTMLElement | null = document.querySelector(".catchup-button-root");
      if (catchupButton) {
        const buttonRect: DOMRect = catchupButton.getBoundingClientRect();
        const buttonTop: number = buttonRect.top;
        const buttonLeft: number = buttonRect.left;
        const buttonWidth: number = buttonRect.width;
        const toastTop: number = buttonTop + 60 - 19;
        const toastLeft: number = buttonLeft + (buttonWidth / 2) - 127.5 + 5;

        //for notification toast of added to catchup later
        document.documentElement.insertAdjacentHTML("beforeend", `<div class="extension-toast" style="position:fixed; top:${toastTop}px; left:${toastLeft}px">
    <div class="extension-toast-inner">
    <img src=${chrome.runtime.getURL("../assets/boxTick.svg")} alt="boxTick" />
    </div>
    <p class="extension-toast-inner"></p>
    <div class="extension-toast-cancel">
    <img src=${chrome.runtime.getURL("assets/cancel.svg")} alt="cancel" />
    </div>
    </div>`)
        const cancelButton = document.querySelector(".extension-toast-cancel");
        cancelButton.addEventListener("click", () => {
          const toast = document.querySelector(".extension-toast");
          if (toast) {
            toast.classList.remove("active");
          }
        })
      }
    })

    // Routing service
    window.addEventListener("hashchange", async (event: HashChangeEvent) => {
      console.log("hashchanged");
      switch (window.location.hash) {
        default:
          handleMailOpened();
      }
    });


    let mailOpenedTimeout = null;
    let isFirstExecution = true;

    function handleMailOpened() {
      if (window.location.hash.includes("#label/catchup")) {
        setTimeout(() => {
          //to get mail's messageId
          const targetElement = document.querySelector("[jsaction='JcCCed:.CLIENT']");
          if (targetElement) {
            console.log("enteringgg");
            const mailDetail = extractMailData(targetElement);
            if (mailDetail) {
              console.log("Target catchup element:", targetElement);
              console.log("Subjectt catchup:", mailDetail);

              // Send message to React app
              const iframeElement = document.querySelector(".extension-container-iframe--extension-outersidebar iframe");
              if (iframeElement) {
                const iframeWindow = iframeElement.contentWindow;
                const wrapper = util.create_window_wrap(window, iframeWindow);
                wrapper.exec('catchup_mail_opened', { mailDetail });
              }
            }
          }
          else {
            console.log("msg send mail closed_label")
            const iframeElement = document.querySelector(".extension-container-iframe--extension-outersidebar iframe");
            if (iframeElement) {
              const iframeWindow = iframeElement.contentWindow;
              const wrapper = util.create_window_wrap(window, iframeWindow);
              wrapper.exec('catchup_mail_closed');
            }
          }
          // Decrease the timeout after the first execution
          setTimeout(() => {
            isFirstExecution = false;
          }, 1600);
        }, isFirstExecution ? 1600 : 800);
      }
      else {
        console.log("came here");
        //to get mail's messageId
        setTimeout(() => {
          const targetElement = document.querySelector("[jsaction='JcCCed:.CLIENT']");
          if (targetElement) {
            const mailDetail = extractMailData(targetElement);
            if (mailDetail) {
              console.log("Target element:", targetElement);
              console.log("Subjectt:", mailDetail);
              // Send message to React app
              const iframeElement = document.querySelector(".extension-container-iframe--extension-outersidebar iframe");
              if (iframeElement) {
                const iframeWindow = iframeElement.contentWindow;
                const wrapper = util.create_window_wrap(window, iframeWindow);
                wrapper.exec('mail_opened', { mailDetail });
              }
            }
          }
          else {
            console.log("msg send mail closed")
            const iframeElement = document.querySelector(".extension-container-iframe--extension-outersidebar iframe");
            if (iframeElement) {
              const iframeWindow = iframeElement.contentWindow;
              const wrapper = util.create_window_wrap(window, iframeWindow);
              wrapper.exec('mail_closed');
            }
          }
        }, 600);
      }
    }


    function extractMailData(node: any) {
      const subjectElement = node.querySelector('h2');
      const messageId = subjectElement.getAttribute("data-legacy-thread-id");
      const singleMailUrl = window.location.href;
      if (subjectElement && messageId) {
        const subject = subjectElement.textContent;
        return { subject, messageId, singleMailUrl };
      }
      return null;
    }

  }

  async detect_dom(index: number) {

    function detectAndChangeTheme() {
      // console.log("fff");
      let catchupBtn = document.getElementsByClassName("catchup-button-root__title")[0];
      let catchupBtnn = document.getElementsByClassName("catchup-button-root")[0];
      console.log("catchupBtn, catchupBtnIcon " + catchupBtn);
      if (window.matchMedia && catchupBtn) {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          console.log("i entered dark");
          catchupBtn.style.color = 'white';
          catchupBtnn.addEventListener('mouseenter', function () {
            catchupBtnn.style.backgroundColor = 'rgb(65,65,65)';
          });

          catchupBtnn.addEventListener('mouseleave', function () {
            catchupBtnn.style.backgroundColor = '';
          });
        }
        else {
          catchupBtn.style.color = 'black';
        }
      }
    }
    // detectAndChangeTheme();

    function insertFloatingButton() {
      console.log("invokeddd2");

      // Create the floating button container element
      var floatingOuterDiv = document.createElement('div');
      floatingOuterDiv.id = 'floatingOuterDiv';

      if (!floatingOuterDiv.getAttribute("data-extension-detected")) {
        console.log("detectedd", floatingOuterDiv.getAttribute("data-extension-detected"));
        // Create the floating button element
        var floatingButton = document.createElement('div');
        floatingButton.id = 'floatingButton';

        // Create the image element inside the button
        var image = document.createElement('img');
        image.src = chrome.runtime.getURL("assets/innerlogo.svg");
        image.alt = "logo";
        image.classList.add("floatingButtonImage");

        //drag Icon
        var dragIcon = document.createElement('img');
        dragIcon.id = 'dragIcon';
        dragIcon.src = chrome.runtime.getURL("assets/GAdrag.svg");

        floatingButton.appendChild(image);// Append the image to the button
        // floatingButton.appendChild(dragIcon);
        floatingOuterDiv.appendChild(dragIcon);
        floatingOuterDiv.appendChild(floatingButton);

        floatingButton.addEventListener('click', function () {
          toggleSidebar();
        });

        // Insert the floating button container into the document body
        document.body.appendChild(floatingOuterDiv);
        floatingOuterDiv.addEventListener('mouseover', showFloatingButtonAnimation);
        floatingOuterDiv.addEventListener('mouseout', hideFloatingButtonAnimation);
        floatingOuterDiv.addEventListener('mousedown', startDrag);
        floatingOuterDiv.setAttribute("data-extension-detected", "true");

      }
    }

    function showFloatingButtonAnimation() {
      document.getElementById('floatingButton').style.animation = 'slideRightToLeft 0.3s ease-in-out forwards';
    }

    function hideFloatingButtonAnimation() {
      document.getElementById('floatingButton').style.animation = 'none';
    }

    function startDrag(e) {
      e.preventDefault();

      var startY = e.clientY;
      var floatingOuterDiv = document.getElementById('floatingOuterDiv');
      var floatingButtonHeight = floatingOuterDiv.offsetHeight;
      var viewportHeight = window.innerHeight;

      document.onmousemove = function (e) {
        var newY = startY - e.clientY;
        startY = e.clientY;

        // Calculate the new position of the floating button
        var newTop = floatingOuterDiv.offsetTop - newY;

        // Check if the new position exceeds the top or bottom boundaries of the viewport
        if (newTop < 0) {
          newTop = 0;
        } else if (newTop + floatingButtonHeight > viewportHeight) {
          newTop = viewportHeight - floatingButtonHeight;
        }

        // Update the position of the floating button
        floatingOuterDiv.style.top = newTop + 'px';
      };

      document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    }

    function toggleSidebar() { // Function to toggle the sidebar
      var outerSidebar = document.querySelector('.extension-container-iframe--extension-outersidebar');
      console.log("outers", outerSidebar);
      if (outerSidebar.classList.contains('active')) {
        outerSidebar.classList.remove('active');
      } else {
        outerSidebar.classList.add('active');
      }
    }

    function injectOuterSidebar() {
      (async () => {
        const sidebar = new OuterSideBar({ width: 320 });
        util.create_window_api(sidebar);
        sidebar.init();
        await sidebar.inject();
      })();
    }

    document.addEventListener('DOMContentLoaded', function () {
      console.log("invoked");
      insertFloatingButton();
      injectOuterSidebar();
    });


    //catchulater inside header
    // let headerDiv = document.querySelector("[jsaction='NqvLIb:.CLIENT;swrS2e:.CLIENT']");
    // if (headerDiv) {
    //   let childDiv = headerDiv.querySelector(".G-tF");

    //   let fourthDiv = childDiv.querySelector(":nth-child(5)");
    //   // console.log("fourthDiv", fourthDiv);
    //   // Insert the element next to the fourth div
    //   if (fourthDiv && !fourthDiv.getAttribute("data-extension-detected")) {
    //     fourthDiv.setAttribute("data-extension-detected", "true");
    //     let catchupIcon = new CatchupIcon(fourthDiv,"afterend");
    //     catchupIcon.init();
    //     let aeHElements = document.querySelectorAll(".aeH");
    //     if (aeHElements.length > 0) {
    //       let lastAeHElement = aeHElements[aeHElements.length - 1];
    //       let catchupIcon = new CatchupIcon(lastAeHElement, "beforebegin");
    //       catchupIcon.init();
    //     } 
    //   }
    // }


    //catchup button
    let catch_selectors = document.querySelector("[role='navigation'] [aria-labelledby]");
    if (!catch_selectors) {
      catch_selectors = document.querySelector("[role='navigation'] + div [aria-labelledby]");
    }
    if (catch_selectors) {
      const bylDiv = catch_selectors.querySelector(".byl");
      if (bylDiv) {
        const tkDiv = bylDiv.querySelector(".TK");
        if (tkDiv) {
          // const firstDivInsideTk = tkDiv.querySelector("div:first-child");
          if (tkDiv) {
            // console.log("First div insideTK", firstDivInsideTk);
            if (tkDiv && !tkDiv.getAttribute("data-extension-detected")) {
              tkDiv.setAttribute("data-extension-detected", "true");

              const catch_up_button = new CatchupButton(tkDiv, "beforeend");
              catch_up_button.init();
            }
          }
        }
      }
    }
  }
}

