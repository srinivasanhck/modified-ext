// @ts-nocheck
import PopupController from "./PopupController";
import GmailIntegration from "../integrations/Gmail";

import Util from "../util/Util";

class ContentController {
  popup: any;
  site: any;

  async init() {
    // console.log(2, "contentcontroller");

    this.popup = new PopupController();

    this.popup.handle_popup_ready = () => {
      // console.log(10,"has entered handle_popup_ready, this.site = " + this.site);
      if (this.site) {
        this.site.popup_wrap = Util.create_window_wrap(window, this.popup.iframe_el.contentWindow);
        this.site.detect_dom();
      }
    };

    Util.create_window_api(this.popup);
    this.popup.init();

    // chrome.runtime.onMessage.addListener() listens for messages from the background script
    chrome.runtime.onMessage.addListener((res: any, sender, callback) => {
      // console.log(6,"msg from popup");
      console.log("res.action",res.action);
      switch (res.action) {
        case "click-action":
          this.handle_click_action();
          break;

        case "iframe-destroy":
          this.handle_iframe_destroy(res.data);
          break;
      }

      callback(null);
    });
    
    this.site = new GmailIntegration();
    Util.create_window_api(this.site);

    Util.find(this.site.loaded_selector, async () => {
      this.create_and_inject_script();
      this.create_and_inject_style("/css/index.css");
      this.handle_site_content_loaded();
    });
  }


  handle_site_content_loaded() {
    // console.log("Site content loaded cc.ts")
    this.site.init();

    Util.set_interval(async (index: number) => {
      await this.site.detect_dom(index);
    }, 1000);
  }

  async handle_iframe_destroy(data: any) {
    this.popup.destroy();
  }

  async handle_click_action() {
    // console.log("handle_click_action");
    if (!this.popup.injected) {
      this.popup.inject();
    }
    if (this.popup.opened) {
      this.popup.hide();
    } else {
      this.popup.show();
    }
  }

  create_and_inject_script() {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("ExtensionInjectedScript.js");

    document.documentElement.prepend(script);
  }

  create_and_inject_style(path: string) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL(path);

    document.documentElement.prepend(link);
  }
}

export default ContentController;
