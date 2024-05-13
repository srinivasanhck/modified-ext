import { TESTING_URL } from "@/ApiLinks";
import { Skeleton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import CATCHUPLATERBLACK from "../assets/sidebar/catchuplaterBlack.svg";
import "../css/catchupMails.css";
import CATCHUPEMPTY from "../assets/LandingPage/catchupEmptyBox.gif";
import BACK from "../assets/sidebar/backSVG.svg";
import { window_send_message } from "@/store";

interface Mail {
  id: number;
  title: string;
  standardEmailId: string;
  userEmail: string | null;
  userId: number;
  createdDate: string;
  updatedDate: string | null;
  catchUpLater: boolean;
  mailUrl: string;
}


const CatchupMails = ({ handleBackToLP, showBackToMail }: any) => {

  const [fetchedMails, setFetchedMails] = useState<Mail[]>([]);
  const [loading, setLoading] = useState(false);

  const handleBackClick = () => {
    handleBackToLP(); // Call the callback function provided by the parent
  };

  useEffect(() => {
    fetchAllMails();
  }, [])

  const fetchAllMails = async () => {
    try {
      setLoading(true);
      let res = await fetch(`${TESTING_URL}/api/v1/emails/catch-up-later-emails/users`, {
        headers: {
          "content-type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('access')}`
        }
      })
      let response = await res.json();
      setFetchedMails(response);
      setLoading(false);
      console.log("res at cupMails", response);
    }
    catch (err) {
      setLoading(false);
      console.log(err);
    }
  }

  // const formattedCurrentDate = (dateString:any) => {
  //   return new Date(dateString).toLocaleString('en-US', {
  //     weekday: 'short',
  //     month: 'short',
  //     day: '2-digit',
  //     year: 'numeric'
  //   });
  // };

  const formattedCurrentDate = (dateString: any) => {
    const utcDate = new Date(dateString); // Parse the date string
    const utcDateString = utcDate.toISOString(); // Convert to UTC string
    return new Date(utcDateString).toLocaleString('en-US', { // Convert back to Date object in UTC
      timeZone: 'UTC', // Set time zone to UTC
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };
  

  async function openParticularMail(messageId: any) {
    if(!messageId){
      console.log("emptyyy");
      return;
    }
    await window_send_message("parent", "handle_open_particular_mail", messageId);
  }

  console.log("fetchedAllCUP",fetchedMails)
  const groupedTasksByDate: { [key: string]: any[] } = {};

  fetchedMails.length > 0 && fetchedMails.forEach(ele => {
    const date = formattedCurrentDate(ele.createdDate);
    if (!groupedTasksByDate[date]) {
      groupedTasksByDate[date] = [ele];
    } else {
      groupedTasksByDate[date].push(ele);
    }
  });


  return (
    <>
      {loading ? (
        <div className="loaderInOutersidebar">
          <Skeleton animation="wave" width={280} height={120} style={{ marginLeft: "10px" }} />
          <Skeleton animation="wave" width={280} height={120} style={{ marginLeft: "10px", marginTop:"-20px" }} />
          <Skeleton animation="wave" width={280} height={120} style={{ marginLeft: "10px", marginTop:"-20px" }} />
          <Skeleton animation="wave" width={280} height={120} style={{ marginLeft: "10px", marginTop:"-20px" }} />
          <Skeleton animation="wave" width={280} height={120} style={{ marginLeft: "10px", marginTop:"-20px" }} />
        </div>
      ) : (
        <>
          {Object.keys(groupedTasksByDate).length > 0 ? (
            <div className="OuterDivCM">
              {Object.keys(groupedTasksByDate).map(date => (
                <div key={date}>
                  <div className="showCreatedDateDiv">{date}</div>
                  {groupedTasksByDate[date].map(task => (
                    <div className="OuterDivInnerCM" key={task.id} onClick={() => openParticularMail(task.mailUrl)}>
                      <div className="MailOuterCM">
                        <p>{task.title}</p>
                        <div>
                          <img src={CATCHUPLATERBLACK} alt="" /> Catch Up Later
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="emptyMailsInCM">
              <div>
              <img src={CATCHUPEMPTY} alt="" />
              <div className="emptyMailsInCMInnerDiv">
                <p>No Catch Up Later to show</p>
                <p>Add your important  mail to catch up later to connect with them later.</p>
              </div>
              </div>
            </div>
          )}
        </>
      )}
      
      {
        showBackToMail &&
   
      <Tooltip title="back">
        <button className="backButtonCM" onClick={handleBackClick}><img src={BACK} alt="" /></button>
      </Tooltip>
} 
    </>
  );
}

export default CatchupMails
