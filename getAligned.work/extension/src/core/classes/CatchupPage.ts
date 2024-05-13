import { APP_URL } from "../../../../shared/config";
import IframeBase from "../bases/IframeBase";

export default class CatchupPage extends IframeBase{
    // url = APP_URL + "/catchup-page";
    name = "extension-catchup-page";
    style_source = chrome.runtime.getURL("/css/catchup-page/style.css");
    opened = true;
    draggable = false;

    async handle_catchup_page_iframe_ready() {
        console.log("catchup page iframe ready");
    //     this.iframe_is_ready = true;
    //     this.iframe_el.classList.add("extension-iframe-ready");
    
    //     this._iframe_ready_resolver();
    //     this._iframe_ready_resolver = null;
    
    //     this.handle_popup_ready();

      
      }
    
      handle_popup_ready() {}
}