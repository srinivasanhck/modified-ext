import Component from "../bases/Component";

export default class InnerLogo extends Component {
  component_class_selector = "extension-innerLogo-root";

  mounted() {
    console.log("InnerrLogo mounted");
    this.component_el.addEventListener("click", async (event: MouseEvent) => {
      console.log("button clickedd");
      alert("clicked");
    })
    }

  template() {
    return /*html*/ `
      <img src="${chrome.runtime.getURL("assets/innerlogo.svg")}" alt="logo">

      <style>
        .extension-innerLogo-root {
          width: 30px;
          cursor: pointer;
          margin-left: 1rem;
        }
        .extension-innerLogo-root:hover {
          cursor: pointer !important;
        }

        .extension-innerLogo-root img {
          width: 100%;
        }
      </style>
    `;
  }
}

