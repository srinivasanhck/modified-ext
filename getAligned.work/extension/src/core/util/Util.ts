// @ts-nocheck

class Util {
  windows: any = {
    current: null,
    parent: null,
    grand_parent: null,
  };

  window_request: any = null;

  init() {
    console.log("util init")
    if (this.window_exists()) {
      console.log("util init 1")
      this.windows.current = this.create_window_wrap(window, window);
      this.windows.parent = this.create_window_wrap(window, window.parent);
      this.windows.grand_parent = this.create_window_wrap(window,window.parent.parent);
    }

    this.window_request = this._window_request();
  }

  window_exists() {
    console.log("window_exists");
    try {
      window;
      return true;
    } catch {
      return false;
    }
  }

  // window_exists() {
  //   return typeof window !== 'undefined';
  // }

  _window_request() {
    let requestId = 0;

    function getData(data: any) {
      let id = requestId++;

      return new Promise(function (resolve, reject) {
        let listener = function (evt: any) {
          if (evt.detail.requestId == id) {
            window.removeEventListener("sendWindowData", listener);
            resolve(evt.detail.data);
          }
        };

        window.addEventListener("sendWindowData", listener);

        const payload = { data: data, id: id };

        window.dispatchEvent(new CustomEvent("getWindowData", { detail: payload }));
      });
    }

    return { getData: getData };
  }

  async find(selector: string, cb?: any) {
    return await this.set_interval(() => {
      const node = document.querySelector(selector);

      if (node) {
        cb(node);

        return {
          clear: true,
          result: node,
        };
      }
    }, 500);
  }

  wait(time: number = 1000) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  override_xhr(callback: any) {
    var _open = XMLHttpRequest.prototype.open;
    var _setRequestHeader = window.XMLHttpRequest.prototype.setRequestHeader;

    window.XMLHttpRequest.prototype.setRequestHeader = function (name, value) {
      if (!this.chromane_request_headers) {
        this.chromane_request_headers = {};
      }

      this.chromane_request_headers[name] = value;

      return _setRequestHeader.apply(this, arguments);
    };

    window.XMLHttpRequest.prototype.open = function (method, request_url) {
      this.addEventListener("load", (event: any) => {
        if (
          (this.readyState === 4 &&
            this.status === 200 &&
            this.responseType === "text") ||
          this.responseType === ""
        ) {
          callback({
            name: "xhr_response_captured",
            data: {
              status: this.status,
              response_text: this.responseText,

              request_url: request_url,
              response_url: this.responseURL,

              request_headers: this.chromane_request_headers,
            },
          });
        }

        if (this.responseType === "blob") {
          const blob = this.response as Blob;
          const reader = new FileReader();

          reader.onload = (event: ProgressEvent<FileReader>): void => {
            const response = event.target?.result as string;
            callback({
              name: "xhr_response_captured",
              data: {
                status: this.status,
                response_blob: response,
                response_type: "blob",
                request_url: request_url,
                response_url: this.responseURL,

                request_headers: this.chromane_request_headers,
              },
            });
          };
          reader.readAsText(blob);
        }
      });

      return _open.apply(this, arguments);
    };
  }

  override_fetch(callback: any) {
    var _fetch = window.fetch;

    window.fetch = async function (request_url, options) {
      var request, url;
      if (arguments[0] instanceof Request) {
        request = arguments[0];
        url = request.url;
      } else {
        request = arguments[1];
        url = arguments[0];
      }

      if (request instanceof Request) {
        var request_clone = request.clone();
        var request_text = await request_clone.text();
      } else {
        var request_text = "";
      }

      var response = await _fetch.apply(window, arguments);
      var response_clone = response.clone();
      var response_text = await response_clone.text();

      var message = {
        name: "fetch_response_captured",
        data: {
          status: response_clone.status,
          response_text: response_text,
          response_url: url,

          request_url,
          request_text,
          request_options: options,
          response_headers: {},
          response_body: {},
        },
      };

      if (arguments[1] && arguments[1].headers) {
        if (arguments[1].headers instanceof Headers) {
          message.data.response_headers = {};

          for (var pair of arguments[1].headers.entries()) {
            message.data.response_headers[pair[0]] = pair[1];
          }
        } else {
          message.data.response_headers = arguments[1].headers;
        }
      }

      if (arguments[1] && arguments[1].body) {
        message.data.response_body = arguments[1].body;
      }

      callback(message);

      return response;
    };
  }

  // runtime_send_message() enables communication between background and content scripts.
  runtime_send_message(tab_id: number, message: any) {
    console.log("runtime_send_message",message);
    return new Promise((resolve) => {
      chrome.tabs.sendMessage(tab_id, message, (response) => {
        if (chrome.runtime.lastError) {
          resolve(false);
        }
        resolve(response);
      });

      return true;
    });
  }

  tab_create(props: any) {
    return new Promise((resolve: any) => {
      chrome.tabs.create(props, (new_tab) => {
        chrome.tabs.onUpdated.addListener(function (tabId, data) {
          if (data.status === "complete" && tabId === new_tab.id) {
            resolve(new_tab);
          }
        });
      });
    });
  }

  async set_interval(callback: any, time: number) {
    // console.log("set_interval in util")
    let index = 0;

    let running = true;

    // sec
    const TIMEOUT = 6;

    while (running) {
      let waiting = 0;
      let _resolver = null;
      let timer = null;

      timer = setInterval(() => {
        waiting++;
        console.log("WAITING FOR SET INTERVAL", waiting);

        if (waiting >= TIMEOUT) {
          clearInterval(timer);
          _resolver();
        }
      }, 1000);

      const res = await new Promise(async (resolve) => {
        _resolver = resolve;
        const r = await callback(index);

        clearInterval(timer);
        _resolver(r);
      });

      if (res?.clear) {
        running = false;
        return res?.result;
      }

      await this.wait(time);

      index++;
    }
  }

//  to send message to other window wrap(window(current window), target(react window, give the iframe of that particular iframe))
  create_window_wrap(window: Window, target_window: Window) {
    let _resolvers: any = [];

    // Add an event listener to the original window for handling postMessage events
    window.addEventListener("message", async (event) => {
      // console.log("event1", event);
      if (event.data) {
        let name = event.data.name;
        let meta = event.data.meta;
        let data = event.data.data;

        // Verifies that the message name is "exec_result", indicating a response
        if (
          name === "exec_result" &&
          meta &&
          meta.response &&
          _resolvers[meta.request_id]
        ) {
          _resolvers[meta.request_id](data.result);
        }
      }
    });

    return {
      exec: (name: string, data?: any) => {
        return new Promise((r) => {
          let request_id = _resolvers.length;
          _resolvers.push(r);
          let meta = { request_id, request: true };
      // console.log("return promise",{ name, meta, data })
          target_window.postMessage({ name, meta, data }, "*");
        });
      },
    };
  }

  // When a message is received, it checks if it corresponds to any of the custom methods defined. and also to recieve messages from from other window
  create_window_api(methods: any) {
    // console.log("Creating window api")
    window.addEventListener("message", async (event: any) => {
      // console.log("event2", event);
      if (event.data) {
        let name = event.data.name;
        let meta = event.data.meta;
        let data = event.data.data;
        if (methods[name]) {
          try {
            var result = await methods[name](data);
          } catch (e) {
            var result = null;
          }
          if (event.source && event.source.postMessage) {
            let source = event.source as Window;
            // console.log("sourcee",source)
            source.postMessage(
              {
                name: "exec_result",
                meta: {response: true,request_id: meta.request_id,},
                data: { result },
              },
              "*"
            );
          }
        }
      }
    });
  }

  object_to_string(obj: any) {
    console.log("object_to_string");
    try {
      return JSON.stringify(obj);
    } catch {
      return obj;
    }
  }

  async contenteditable_paste(contenteditable: any, text: any) {
    console.log("contenteditable_paste");
    function selectElementContents(el) {
      var range = document.createRange();
      range.selectNodeContents(el);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }

    selectElementContents(contenteditable);

    await this.wait(100);

    const dt = new DataTransfer();
    dt.setData("text/plain", text);

    const clipboard_event = new ClipboardEvent("paste", {
      clipboardData: dt,
      bubbles: true,
    });

    contenteditable.dispatchEvent(clipboard_event);

    contenteditable.value = text;
    contenteditable.innerHTML = text;

    contenteditable.dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true })
    );
    contenteditable.dispatchEvent(
      new KeyboardEvent("keypress", { bubbles: true })
    );
    contenteditable.dispatchEvent(
      new KeyboardEvent("keyup", { bubbles: true })
    );
    contenteditable.dispatchEvent(new Event("input", { bubbles: true }));
    contenteditable.dispatchEvent(new Event("change", { bubbles: true }));
  }

  async contenteditable_type(contenteditable: any, text: any, options = {}) {
    console.log("contenteditable_type");
    if (options.clear_before) {
      await this.contenteditable_paste(contenteditable, "");
    }

    for (let letter of text.split("")) {
      const dt = new DataTransfer();
      dt.setData("text/plain", letter);

      const clipboard_event = new ClipboardEvent("paste", {
        clipboardData: dt,
        bubbles: true,
      });

      contenteditable.dispatchEvent(clipboard_event);

      contenteditable.value += letter;
      contenteditable.innerHTML += letter;

      contenteditable.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true })
      );
      contenteditable.dispatchEvent(
        new KeyboardEvent("keypress", { bubbles: true })
      );
      contenteditable.dispatchEvent(
        new KeyboardEvent("keyup", { bubbles: true })
      );
      contenteditable.dispatchEvent(new Event("input", { bubbles: true }));
      contenteditable.dispatchEvent(new Event("change", { bubbles: true }));

      await this.wait(10 + Math.random() * 10);
    }
  }
}

const util = new Util();
// console.log("startt util")
util.init();

export default util;
