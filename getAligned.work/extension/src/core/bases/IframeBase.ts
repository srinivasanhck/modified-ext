const POPUP_X_POSITION_DEFAULT = 20;
const POPUP_Y_POSITION_DEFAULT = 20;

const POPUP_WIDTH_DEFAULT = 450;
// const POPUP_HEIGHT_DEFAULT = 550;
const POPUP_HEIGHT_DEFAULT = 550;

class IframeBase {
  // Params
  // Iframe name attribute
  name: string | null = "extension-iframe";

  // iframe src (string)
  url: string | null = null;

  // url (string)
  style_source: string | null = null;

  // selector (string) | object (node) | function (function)
  root: any = document.documentElement;

  width = POPUP_WIDTH_DEFAULT;
  height = POPUP_HEIGHT_DEFAULT;

  x_position = POPUP_X_POSITION_DEFAULT;
  y_position = POPUP_Y_POSITION_DEFAULT;

  draggable: boolean = true;

  // Elements
  iframe_container: HTMLDivElement | null = null;
  iframe_el: HTMLIFrameElement | null = null;

  // States popup
  injected = false;
  opened = false;
  iframe_is_ready = false;

  moving = false;

  start_mouse_position_x: any = null;
  start_mouse_position_y: any = null;

  x_difference_last: any = null;
  y_difference_last: any = null;

  // Resolvers
  _iframe_ready_resolver: any = null;

  // Nodes
  move_el: any = null;

  constructor(options: any = {}) {
    // console.log(3, "entered iframe");
    this.root = options.root || this.root;
    this.name = options.name || this.name;

    this.url = options.url || this.url;

    this.width = options.width || this.width;
    this.height = options.height || this.height;

    this.x_position = options.x_position || this.x_position;
    this.y_position = options.y_position || this.y_position;

    this.draggable = options.draggable || this.draggable;
  }

  init() {
    // console.log(4,"iframebase init()")
    const elements = this._create_iframe_container_node(); //to create iframe inside div
    this.iframe_container = elements.iframe_container_el;
    this.iframe_el = elements.iframe_el;
    console.log("elements" , this.iframe_container, "and",this.iframe_el);

    if (this.opened) {
      this._show_iframe_style();
    } else {
      this._hide_iframe_style();
    }

    this._inject_extra_style();
  }

  handle_document_mousemove(event: MouseEvent) {
    if (!this.get_action_controls_status()) return;

    event.stopPropagation();

    this.x_difference_last = this.start_mouse_position_x - event.screenX;
    this.y_difference_last = event.screenY - this.start_mouse_position_y;

    if (this.moving) {
      // Move X
      if (
        this.x_position + this.x_difference_last >= 0 &&
        this.x_position + this.x_difference_last <=
          this.viewport_width - this.width
      ) {
        this.iframe_container.style.right = `${
          this.x_difference_last + this.x_position
        }px`;
      }

      if (this.x_position + this.x_difference_last < 0) {
        this.iframe_container.style.right = `${0}px`;
      }

      if (
        this.x_position + this.x_difference_last >
        this.viewport_width - this.width
      ) {
        this.iframe_container.style.right = `${
          this.viewport_width - this.width
        }px`;
      }

      // Move Y
      if (
        this.y_position + this.y_difference_last >= 0 &&
        this.y_position + this.y_difference_last <=
          this.viewport_height - this.height
      ) {
        this.iframe_container.style.top = `${
          this.y_difference_last + this.y_position
        }px`;
      }

      if (this.y_position + this.y_difference_last < 0) {
        this.iframe_container.style.top = `${0}px`;
      }

      if (
        this.y_position + this.y_difference_last >
        this.viewport_height - this.height
      ) {
        this.iframe_container.style.top = `${
          this.viewport_height - this.height
        }px`;
      }
    }
  }

  get_action_controls_status() {
    return this.moving;
  }

  reset_popup_position() {
    this.x_position = POPUP_X_POSITION_DEFAULT;
    this.y_position = POPUP_Y_POSITION_DEFAULT;

    this.iframe_container.style.right = `${POPUP_X_POSITION_DEFAULT}px`;
    this.iframe_container.style.top = `${POPUP_Y_POSITION_DEFAULT}px`;
  }

  handle_document_mousedown(event: MouseEvent) {
    if (event.which !== 1) return;

    const target_el: any = event.target;

    if (this.injected) {
      if (this.move_el.contains(target_el)) {
        this.moving = true;
      }
    }

    if (this.get_action_controls_status()) {
      event.stopPropagation();
      event.preventDefault();

      this.start_mouse_position_x = event.screenX;
      this.start_mouse_position_y = event.screenY;

      this.iframe_container.classList.add("dragging");

      document.documentElement.dispatchEvent(
        new MouseEvent("mousemove", {
          bubbles: true,
          screenX: event.screenX,
          screenY: event.screenY,
        })
      );
    }
  }

  get viewport_width() {
    return window.innerWidth;
  }

  get viewport_height() {
    return window.innerHeight;
  }

  handle_document_mouseup(event: MouseEvent) {
    if (!this.get_action_controls_status()) return;

    event.stopPropagation();

    if (this.get_action_controls_status()) {
      this.x_position = this.x_position + this.x_difference_last;
      this.y_position = this.y_position + this.y_difference_last;

      this.iframe_container.classList.remove("dragging");
    }

    this.moving = false;

    this.start_mouse_position_x = null;
    this.start_mouse_position_y = null;
  }

  handle_window_resize(Event: any) {
    this.reset_popup_position();
  }

  destroy() {
    if (!this.injected) return;

    this._remove();
    this.hide();

    this.x_position = POPUP_X_POSITION_DEFAULT;
    this.y_position = POPUP_Y_POSITION_DEFAULT;

    this.iframe_container.style.right = this.x_position + "px";
    this.iframe_container.style.top = this.y_position + "px";

    this.injected = false;
    this.iframe_is_ready = false;

    if (this.draggable) {
      document.removeEventListener(
        "mousedown",
        this.handle_document_mousedown.bind(this)
      );

      document.removeEventListener(
        "mouseup",
        this.handle_document_mouseup.bind(this)
      );

      document.removeEventListener(
        "mousemove",
        this.handle_document_mousemove.bind(this)
      );

      window.removeEventListener(
        "resize",
        this.handle_window_resize.bind(this)
      );
    }
  }

  //it is providing an iframe inside div and returning
  _create_iframe_container_node() {
    const iframe_container_el: HTMLDivElement = document.createElement("div");
    const iframe_el: HTMLIFrameElement = document.createElement("iframe");

    iframe_container_el.classList.add("extension-container-iframe");
    iframe_container_el.classList.add(`extension-container-iframe--${this.name}`);

    iframe_el.src = this.url;
    // console.log("iframe src",this.url,this.width,this.height)
    iframe_el.name = this.name;

    iframe_container_el.style.width = `${this.width}px`;
    iframe_container_el.style.height = `${this.height}px`;

    iframe_container_el.style.right = `${this.x_position}px`;
    iframe_container_el.style.top = `${this.y_position}px`;

    iframe_container_el.insertAdjacentHTML(
      "beforeend",
      /*html*/ `
      ${
        this.draggable
          ? `
            <div class="extension-container-iframe__move">
              <img src="${chrome.runtime.getURL("/assets/drag.svg")}">
            </div>
          `
          : ""
      }
      <div class="extension-container-iframe__overlay"></div>
      `
    );

    iframe_container_el.appendChild(iframe_el);

    return {
      iframe_container_el,
      iframe_el,
    };
  }

  _remove() {
    this.root.removeChild(this.iframe_container);
  }

  _hide_iframe_style() {
    this.iframe_container.classList.remove("active");
  }

  _show_iframe_style() {
    this.iframe_container.classList.add("active");
  }

  inject() {
    // console.log("inject called")
    return new Promise((resolve: any) => {
      this._iframe_ready_resolver = resolve;
      // console.log(typeof this.root,this.root); object -entirehtml/div
      switch (typeof this.root) {
        case "object":
          this.root.appendChild(this.iframe_container);
          break;
        case "string":
          document.querySelector(this.root).appendChild(this.iframe_container);
          break;
        case "function":
          this.root().appendChild(this.iframe_container);
          break;
      }

      this.injected = true;

      this._get_popup_controls_el();

      if (this.draggable) {
        document.addEventListener(
          "mouseup",
          this.handle_document_mouseup.bind(this)
        );

        document.addEventListener(
          "mousedown",
          this.handle_document_mousedown.bind(this)
        );

        document.addEventListener(
          "mousemove",
          this.handle_document_mousemove.bind(this)
        );

        window.addEventListener("resize", this.handle_window_resize.bind(this));
      }
    });
  }

  _get_popup_controls_el() {
    this.move_el = document.querySelector(".extension-container-iframe__move");

    // Todo: Get other controls elements if need (resize...)
  }

  async show() {
    // console.log("show called", "iframe")
    if (this.opened) return;

    if (!this.injected) {
      await this.inject();
    }

    this.opened = true;

    this._show_iframe_style();
  }

  hide() {
    if (!this.opened) return;

    this.opened = false;

    this._hide_iframe_style();
  }

  async _inject_extra_style() {
    if (!this.style_source) return;

    const css_link = document.createElement("link");
    css_link.rel = "stylesheet";
    css_link.type = "text/css";
    css_link.href = this.style_source;

    document.documentElement.appendChild(css_link);
  }
}

export default IframeBase;
