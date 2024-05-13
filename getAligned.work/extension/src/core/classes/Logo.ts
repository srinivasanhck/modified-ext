import Component from "../bases/Component";

export default class Logo extends Component {
  component_class_selector = "extension-logo-root";

  template() {
    return /*html*/ `
      <img src="${chrome.runtime.getURL("assets/icon.svg")}" alt="logo">

      <style>
        .extension-logo-root {
          width: 24px;
          cursor: pointer;
        }

        .extension-logo-root img {
          width: 100%;
        }
      </style>
    `;
  }
}
