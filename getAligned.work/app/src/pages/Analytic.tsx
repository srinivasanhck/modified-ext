import { useEffect } from "react";
import { window_send_message } from "@/store";
import Box from "@mui/material/Box";

function SideBar() {
  useEffect(() => {
    // console.log("message sent analytic")
    window_send_message("parent", "handle_analytic_page_iframe_ready")
    .then(response => {
      console.log("Response:", response);
    })
    .catch(error => {
      console.error("Error:", error);
    });
  }, []);

  return (
    <Box className="analytic-page">
      <h2>Analytic Page</h2>
    </Box>
  );
}

export default SideBar;
