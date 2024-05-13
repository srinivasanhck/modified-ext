import { useEffect } from "react";
import { window_send_message } from "@/store";
import icon from "@/assets/icon.svg";

function Tag() {
  useEffect(() => {
    // console.log("tag.tsx")
    window_send_message("grand_parent", "handle_popup_iframe_ready");
  }, []);

  return (
    <div className="tag">
      {/* <div className="tag__label">Label 1</div> */}
      <div className="tag__icon">
        <img src={icon} alt="icon" />
      </div>
      <div className="tag__title">Resumee stage(normal)</div>
    </div>
  );
}

export default Tag;
