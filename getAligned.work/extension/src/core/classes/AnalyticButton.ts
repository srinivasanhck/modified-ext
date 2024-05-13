import Component from "../bases/Component";

export default class AnalyticButton extends Component {
  component_class_selector = "analytic-button-root";

  mounted() {
    // console.log("Analytic Button mounted abtn.ts");
    this.component_el.addEventListener("click", (event: MouseEvent) => {
      window.location.hash = "#analytic";
    });
  }

  template() {
    return /*html*/ `
      <img class="analytic-button-root__icon" src="${chrome.runtime.getURL(
        "assets/icon.svg"
      )}" alt="analytic button">
      <div class="analytic-button-root__title">Analytic pages</div>

      <!-- Style -->
      <style>
        .analytic-button-root {
          display: flex;
          align-items: center;
          height: 32px;
          padding: 0 0px 0 26px;
          cursor: pointer;
          border-radius: 0 16px 16px 0;
          transition-duration: 200ms;
          margin: 0 16px 0 0; 
        }

        .analytic-button-root:hover {
          background-color: rgba(32, 33, 36, 0.06);
        }

        .analytic-button-root__icon {
          width: 20px;
          margin-right: 18px;
        }
      </style>
    `;
  }
}
