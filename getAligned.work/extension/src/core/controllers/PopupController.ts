import IframeBase from "../bases/IframeBase";
import { APP_URL } from "../../../../shared/config";

class PopupController extends IframeBase {
  url = APP_URL + "/popup";
  name = "extension-popup";
  style_source = chrome.runtime.getURL("/css/extension-popup/style.css");
  width = 400;
  height = 500;

  handle_hide_popup() {
    // console.log(8,"has entered handle_hide_popup");
    this.hide();
  }
  
  handle_show_popup() {
    // console.log(9,"has entered handle_show_popup");
    this.show();
  }

  async handle_popup_iframe_ready() {
    // console.log(7,"has entered handle_popup_iframe_ready");
    this.iframe_is_ready = true;
    this.iframe_el.classList.add("extension-iframe-ready");

    this._iframe_ready_resolver();
    this._iframe_ready_resolver = null;

    this.handle_popup_ready();
  }

  handle_popup_ready() {}
}

export default PopupController;
