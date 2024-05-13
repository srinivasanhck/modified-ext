import Component from "../bases/Component";

export default class Tag extends Component {
  component_class_selector = "extension-tag-root";

  template() {
    return /*html*/ `
      <div class="extension-tag-root__label">Label 1</div>
      <div class="extension-tag-root__icon">
        <img src="${chrome.runtime.getURL("assets/icon.svg")}" alt="icon" />
      </div>
      <div class="extension-tag-root__title">Resume</div>

      <!-- Style -->
      <style>
        .extension-tag-root {
          order: 1;
          flex: 1 0 auto;
          padding-right: 32px;
          display: flex;
          align-items: center;
          font-size: 14px;
        }

        .extension-tag-root__label {
          background-color: #d32f2f;
          color: #fafafa;
          border-radius: 4px;
          padding: 2px 5px;
          font-size: 12px;
        }

        .extension-tag-root__icon {
          width: 18px;
          margin-left: 10px;
          display: flex;
        }

        .extension-tag-root__icon img {
          width: 100%;
        }

        .extension-tag-root__title {
          margin-left: 10px;
        }
      </style>
    `;
  }
}
