import GALOGO from "../assets/outersidebar/gaLogo.svg";
import BACKTOGGLE from "../assets/outersidebar/backToggleButton.svg";
// import HAMBURGER from "../assets/outersidebar/hamburgerMenu.svg";
import "../css/outerSidebar.css";
import { Tooltip } from "@mui/material";

interface OuterSidebarHeaderProps {
    handleClose: () => void; 
  }

const OuterSidebarHeader: React.FC<OuterSidebarHeaderProps> = ({handleClose}) => {
  return (
    <div className="outerSidebarHeader">
      <Tooltip title="close">
    <div className="closeImageDiv" onClick={handleClose}>
      <img src={BACKTOGGLE} alt="" />
    </div>
      </Tooltip>
    <div className="getAlignedDiv">
      <img src={GALOGO} alt="" />
      <p>GET ALIGNED</p>
    </div>
    <div className="hamburgerMenu">
      {/* <img src={HAMBURGER} alt="" /> */}
    </div>
  </div>
  )
}

export default OuterSidebarHeader