import Component from "../bases/Component"

export default class CatchupButton extends Component {
    component_class_selector="catchup-button-root";

    mounted(){
        this.component_el.addEventListener("click", (event: MouseEvent) => {
          window.location.hash = "#label/catchup";
          this.component_el.classList.add("active");
          });

          window.addEventListener("hashchange",()=>{
            if (!window.location.hash.includes("#label/catchup")) {
              this.component_el.classList.remove("active");
            }
          })
    }

    template() {
        return /*html*/ `
          <img class="catchup-button-root__icon" src="${chrome.runtime.getURL("assets/catchupi.svg")}" alt="catchpup button">
          <div class="catchup-button-root__title">Catch up later</div>
    
          <!-- Style -->
          <style>

          .catchup-button-root {
            display: flex;
            align-items: center;
            height: 32px;
            padding: 0 0px 0 20px;
            cursor: pointer;
            border-radius: 16px;
            transition-duration: 200ms;
            margin-top:2px;
          }

          img{
            margin-top:0.5px;
          }

            .catchup-button-root:hover {
              background-color: rgba(32, 33, 36, 0.06);
            }
            .catchup-button-root__icon {
                margin-right: 15px;
              }
              .catchup-button-root.active {
                background-color: rgb(211,227,253);
              }
          </style>
        `;
      }
}