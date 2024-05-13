import IframeBase from "../bases/IframeBase";
import { APP_URL } from "../../../../shared/config";

export default class AnalyticPage extends IframeBase {
  url = APP_URL + "/analytic-page";
  name = "extension-analytic-page";
  style_source = chrome.runtime.getURL("/css/analytic-page/style.css");
  opened = true;
  draggable = false;

  async handle_analytic_page_iframe_ready() {
    console.log("Analytic page iframe ready");
    this.iframe_is_ready = true;
    this.iframe_el.classList.add("extension-iframe-ready");

    this._iframe_ready_resolver();
    this._iframe_ready_resolver = null;

    this.handle_popup_ready();

    return {
      data:"some data",
      accessToken:await chrome.storage.sync.get("accessToken")
    }
  }

  handle_popup_ready() {}
}
