export type TPosition = "beforebegin" | "afterbegin" | "beforeend" | "afterend";

export default class Tag {
  // Required
  root: any = null;
  root_el: null | HTMLElement = null;
  position: TPosition = "beforeend";
  data: any = {};

  component_class_selector = "extension-component";
  component_tag = "div";

  // After mount
  component_el: null | HTMLElement = null;

  constructor(root: any, position: TPosition, options: any = {}) {
    this.root = root || this.root;
    if (typeof this.root === "string") {
      this.root_el = document.querySelector(this.root);
    } else {
      this.root_el = this.root;
    }

    this.position = position || this.position;
    this.data = options.data || this.data;
  }

  init() {
    // console.log("component inited() c.ts")
    this.mount();
  }

  set_data(new_data: any) {
    this.data = new_data;

    this.mount();
  }

  unmount() {
    if (!this.component_el) return;

    this.component_el.remove();
  }

  _mounted() {
    // Hook
    // console.log("mounted() c.ts");
    this.mounted();
  }

  mount() {
    // console.log("mounted in component")
    this.unmount();

    this.root_el.insertAdjacentHTML(this.position, this._render());

    this.component_el = this.root_el.parentNode.querySelector(
      `.${this.component_class_selector}`
    );
      // console.log("this.component_ele",this.component_el);
    this._mounted();
  }

  _render() {
    return /*html*/ `
      <${this.component_tag} class="${this.component_class_selector}">
        ${this.template()}
      </${this.component_tag}>
    `;
  }

  // Custom template
  template() {
    return "";
  }

  // Handlers
  mounted() {}
}
