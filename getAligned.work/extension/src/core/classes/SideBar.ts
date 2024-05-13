import IframeBase from "../bases/IframeBase";
import { APP_URL } from "../../../../shared/config";

export default class SideBar extends IframeBase {
  url = APP_URL + "/sidebar";
  name = "extension-sidebar";
  style_source = chrome.runtime.getURL("/css/extension-sidebar/style.css");
  opened = true;
  draggable = false;
 
  handle_sidebar_close() {
    this.iframe_container.style.width = "50px";
  }

  handle_sidebar_open() {
    // console.log("sidebar width",`${this.width}`)
    this.iframe_container.style.width = `${this.width}px`;
  }

  async handle_sidebar_iframe_ready() {
    // console.log("habdle sidebar ifram ready executed in sidebar")
    this.iframe_is_ready = true;
    this.iframe_el.classList.add("extension-iframe-ready");

    this._iframe_ready_resolver();
    this._iframe_ready_resolver = null;

    this.handle_popup_ready();

    // return {
    //   accessToken:await chrome.storage.sync.get("accessToken")
    // }
  }

  handle_popup_ready() {}
}
