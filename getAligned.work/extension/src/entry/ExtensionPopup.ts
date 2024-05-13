import IframeBase from "../core/bases/IframeBase";

import { APP_URL } from "../../../shared/config";

import util from "../core/util/Util";

class ExtensionPopup extends IframeBase {
  opened = true;
  draggable = false;
  window_wrap: any = null;

  async forward_in(props: any) {
    this.window_wrap = util.create_window_wrap(
      window,
      this.iframe_el.contentWindow
    );

    return await this.window_wrap.exec(props.name, props.data);
  }

  async get_storage(data: any) {
    const res: any = await chrome.storage.local.get(data.key);

    if (!Object.keys(res).length) return data.default;

    return res[data.key];
  }

  async set_storage(data: any) {
    await chrome.storage.local.set({ [data.key]: data.value });
  }
}

async function bootstrap() {
  const options: any = {};

  console.log("window.name!!!!!!!", window.name);

  switch (window.name) {
    case "tag":
      options.url = APP_URL + "/tag";
      break;
    case "extension-popup":
      options.url = APP_URL + "/popup";
      break;
  }

  const extension_popup = new ExtensionPopup(options);

  util.create_window_api(extension_popup);

  extension_popup.init();

  await extension_popup.inject();
}

bootstrap();
