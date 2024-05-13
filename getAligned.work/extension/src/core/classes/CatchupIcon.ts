import Component from "../bases/Component";

export default class CatchupIcon extends Component {
  component_class_selector = "extension-catchupIcon-root";

  mounted() {
    console.log("catchupIcon mounted");
    this.component_el.addEventListener("click", async (event: MouseEvent) => {
      console.log("button clickedd");
      alert("click");
    })
    }

  template() {
    return /*html*/ `
      <img src="${chrome.runtime.getURL("assets/catchupIcon.svg")}" alt="logo">

      <style>
        .extension-catchupIcon-root {
          width: 20px;
          cursor: pointer;
          margin-right: 0.5rem;
        }
        .extension-catchupIcon-root:hover {
          cursor: pointer !important;
        }

        .extension-catchupIcon-root img {
          width: 100%;
        }
      </style>
    `;
  }
}
