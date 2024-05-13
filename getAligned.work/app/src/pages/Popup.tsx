import { useEffect } from "react";
import { window_send_message } from "@/store";

function Tag() {
  useEffect(() => {
    // console.log(5,"popup.tsx");
    window_send_message("parent", "handle_popup_iframe_ready");
  }, []);

  return (
    <>
    {/* <h3>Popup</h3>
    <button>Authenticate</button> */}
    </>
  )
}

export default Tag;
