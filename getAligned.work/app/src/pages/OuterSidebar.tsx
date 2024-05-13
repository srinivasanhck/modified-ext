import { window_send_message } from "@/store";
import { useEffect, useRef, useState } from "react";
import util from "@extension_util/Util";
import OuterSidebarHeader from "@/components/OuterSidebarHeader";
import SideBar from "./SideBar";
import { CircularProgress, Skeleton, Tooltip } from "@mui/material";
import NOTES from "../assets/task.svg";
import CATCHUPSVG from "../assets/outersidebar/catchup.svg";
import ADDSVG from "../assets/addSymbol.svg";
// import TaskForm from "./TaskForm";
import LandingPage from "./LandingPage";
import "../css/catchuplater.css";
import { TESTING_URL } from "@/ApiLinks";
import Cookies from 'js-cookie';
import CustomizedSnackbar from "@/snackBar/customizedSnackBar";
import BACKTOHOME from "../assets/outersidebar/backToHome.svg";

const OuterSidebar = () => {
  // const [sidebar_is_opened, set_sidebar_is_opened] = useState(true);

  // const [labelId, setLabelId] = useState(""); // State to store label ID
  const [mailData, setMailData] = useState(""); //set messageId initially
  const [mailSubject, setMailSubject] = useState("")
  const [messageIdForTask, setMessageIdForTask] = useState("");
  const [mailUrl, setMailUrl] = useState("");

  const [isMailOpened, setIsMailOpened] = useState(false); //to check mail opened
  const [_, setRemoveMessageId] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false); // for sidebar open
  const [isLoading, setIsLoading] = useState(false); //skeleton

  const [buttonLoading, setButtonLoading] = useState(false); //catchup button loading

  const [labelAdded, setLabelAdded] = useState(false); //to toggle between catchup add and remove
  // const [catchupLabelAdd, setCatchupLabelAdd] = useState(false); //if mail opened in catchup then used
  const isMailOpenedRef = useRef<boolean>(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false); //snackbar
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSnackbar = (message: string, severity: any) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const [commingFromPrevComponent, setCommingFromPrevComponent ] = useState(true);

  useEffect(() => {
    console.log("222");
    lsCalled();
    async function lsCalled() {
      await mounted();
    }
    util.create_window_api({
      "mail_opened": async ({ mailDetail }: { mailDetail: any }) => {
        if (!isMailOpenedRef.current) {
          isMailOpenedRef.current = true;
          console.log("Received mail detail:", mailDetail);
          setCommingFromPrevComponent(false);
          setIsMailOpened(true);
          setMailSubject(mailDetail.subject);
          setMailUrl(mailDetail.singleMailUrl);
          if (mailDetail.messageId) {
            setMessageIdForTask(mailDetail.messageId);
            let result = await checkIfLabelIsApplied(mailDetail.messageId);
            console.log("resulttt", result);
            if (result) {
              setMailData("");
            }
            else {
              let result = await checkIfTasksArePresent(mailDetail.messageId);
              console.log("returned result", result);
              if (result) {
                setMailData("");
              }
              else {
                console.log("setMailData", mailDetail.messageId);
                setMailData(mailDetail.messageId);
              }
            }
            // setIsLoading(false);
          }
          else {
            // setIsLoading(false);
          }
        }
      },
      "mail_closed": () => {
        console.log("mail_closed msg recieved");
        isMailOpenedRef.current = false;
        setMailData("");
        setIsMailOpened(false);
        setCommingFromPrevComponent(true);
        setSidebarOpen(false);
      },
      "catchup_mail_opened": async ({ mailDetail }: { mailDetail: any }) => {
        if (!isMailOpenedRef.current) {

          isMailOpenedRef.current = true;
          if (mailDetail.messageId) {
            console.log("from catchup_mail_opened", mailDetail.messageId);
            setMessageIdForTask(mailDetail.messageId);
            setMailSubject(mailDetail.subject);
            setLabelAdded(true);
            setMailData("");
            setIsMailOpened(false);
            setSidebarOpen(true);
          }
        }
      },
      "catchup_mail_closed": () => {
        console.log("getting here closed");
        isMailOpenedRef.current = false;
        setMailData("");
        setIsMailOpened(false);
        setSidebarOpen(false);
      },
    });
  }, []);


  const checkIfTasksArePresent = async (messageId: any) => {
    try {
      setIsLoading(true);
      console.log("msgId", messageId)
      const response = await fetch(`${TESTING_URL}/api/v1/tasks/standard-email-id?standardEmailId=${messageId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("access")}`
        }
      });
      const res = await response.json();
      console.log("Tasks present", res);
      if (res.length > 0) {
        setIsLoading(false);
        return true;
      }
      else {
        setIsLoading(false);
        return false;
      }
    }
    catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  async function mounted() {
    const extensionData = await window_send_message("parent", "handle_outerSidebar_iframe_ready");
    console.log("extensionDatA:", extensionData);
    if (extensionData) {
      localStorage.setItem("access", extensionData.accessToken.accessToken);
      Cookies.set("access", extensionData.accessToken.accessToken);
    }
  }

  console.log("mailData: ", mailData, mailSubject, mailUrl);
  console.log("messageIdForTask: ", messageIdForTask);

  async function checkIfLabelIsApplied(messageId: string) {

    try {
      setIsLoading(true);
      let res = await fetch(`${TESTING_URL}/api/v1/emails/catch-up-later-emails/email_id?message_id=${messageId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access')}`
        },
      });
      let result = await res.json();
      console.log("res checkIflabelApplied", result);
      if (result.catchUpLater) {
        setLabelAdded(true);
        setIsLoading(false);
        return true;
      }
      else if (result.message) {
        setLabelAdded(false);
        setIsLoading(false);
        return false;
      }
    }
    catch (err) {
      setLabelAdded(false);
      setIsLoading(false);
      console.log("error at Outersidebar checking label", err);
      return false;
    }

  }

  const handleClose = () => {
    // set_sidebar_is_opened(!sidebar_is_opened);
    console.log("invoked at outersidebar tsx");
    window_send_message("parent", "handle_outer_sidebar_close");
  }

  const removeCatchupLater = async () => {
    // try {
    // const res = await window_send_message("parent", "handle_remove_catchuplayer_from_outer_sidebar");
    // console.log("res", res);
    //  if (res.messageId) {
    setMailData("true");
    setRemoveMessageId("true");
    //       }
    // } catch (error) {
    //   console.error("Error in removeCatchupLater outersidebar:", error);
    // }
  }


  const updateLabelAdded = (value: any) => {
    setLabelAdded(value);
  };

  function formatCustomDate() {
    // Get the current date and time
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // JavaScript months are 0-indexed
    const formattedMonth = month < 10 ? `0${month}` : month;
    const day = now.getDate();
    const formattedDay = day < 10 ? `0${day}` : day;
    const hour = now.getHours();
    const formattedHour = hour < 10 ? `0${hour}` : hour;
    const minute = now.getMinutes();
    const formattedMinute = minute < 10 ? `0${minute}` : minute;

    // Format the date and time
    const formattedDate = `${year}-${formattedMonth}-${formattedDay}T${formattedHour}:${formattedMinute}:00`;
    console.log(formattedDate);
    return formattedDate;
  }

  async function handleCatchupLater() {
    // let response = await window_send_message("parent", "handle_catchuplater_from_outer_sidebar");
    // console.log("responsee from outersidebar.ts", response);

    setButtonLoading(true);
    try {
      const formattedDate = formatCustomDate();
      const response = await fetch(`${TESTING_URL}/api/v1/emails/catch-up-later-emails`, {
        method: "POST",
        body: JSON.stringify({ standardEmailId: messageIdForTask, title: mailSubject, createdDate: formattedDate, mailUrl: mailUrl }),
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${localStorage.getItem("access")}`
        }
      })
      const data = await response.json();
      setTimeout(() => {
        setLabelAdded(true);
        setMailData("");
      }, 1000)
      setButtonLoading(false);
      handleSnackbar("Added to catchup later", "success");
      console.log("handleCatchupLater response", data);
    }
    catch (err) {
      setButtonLoading(false);
      handleSnackbar("Error adding to catchup later", "error");
      console.log("error from handleCatchupLaterFn outersidebar", err);
    }

    // setTimeout(() => {
    //   setButtonLoading(false); // Stop loading
    //   setLabelAdded(true);
    //   setShowTaskForm(false);
    //   setMailData("");
    // }, 3000);
  }

  const [__, setShowTaskForm] = useState(false);

  const handleAddTask = () => {
    setMailData("");
    setShowTaskForm(true);
  }

  const handleBackToHome = () => {
    setIsMailOpened(false);
  }

  const handleGoToPreviousPage = () => {
    setIsMailOpened(true);
  };


  return (
    <div className="outerSidebar">

      <CustomizedSnackbar
        open={snackbarOpen}
        handleClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />

      {/* header */}
      <OuterSidebarHeader handleClose={handleClose} />

      {
        isLoading ? (
          <div className="loaderInOutersidebar">
            <Skeleton animation="wave" width={280} height={300} style={{ marginLeft: "10px" }} />
            <Skeleton animation="wave" width={280} height={300} style={{ marginLeft: "10px", marginTop: "-80px" }} />
          </div>
        ) :
          //this is only for #label/catchup only as of now
          sidebarOpen ? (
            <SideBar labelAdded={labelAdded} messageIdForTaskFn={messageIdForTask} removeCatchupLater={removeCatchupLater} mailSubject={mailSubject} />
          )
            : ( //2

              isMailOpened ? ( //1
                mailData ? (
                  <div className="OuterCatchupLaterDiv">
                    <div className="OuterCatchupLaterFirstDiv">
                      <div className="OuterCatchupLaterFirstDivImage">
                        <img src={NOTES} alt="" />
                      </div>
                      <div className="catchupLaterTextDiv">
                        <p>This email seems important; consider revisiting it later or adding tasks.</p>
                      </div>

                      <div className="OuterCatchupLaterSecondDiv">
                        <div className="catchupLaterDiv">
                          <div className="catchupLaterDiv1">
                            <img src={CATCHUPSVG} alt="" />
                            <span>Revisit Later</span>
                          </div>
                          <div className="catchupLaterButtonDiv">
                            <button className={"catchupLaterButton"} disabled={buttonLoading} onClick={handleCatchupLater}  >
                              {buttonLoading ? <CircularProgress size={26} style={{ color: 'white' }} /> : "Catch Up Later"}
                            </button>
                          </div>
                        </div>
                        <div className="addTasksDiv">
                          <div className="catchupLaterDiv1">
                            <img src={ADDSVG} alt="" />
                            <span>Create Task</span>
                          </div>
                          <div className="addTaskButtonDiv">
                            <button className="addTaskButton" onClick={handleAddTask}>Add Task</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="backToHome" onClick={handleBackToHome}>
                      <Tooltip title="Back to home">
                        <img src={BACKTOHOME} alt="" />
                      </Tooltip>
                    </div>
                  </div>
                ) :
                  (
                    // showTaskForm ? 
                    //   <TaskForm onClicked={handleFormExit} messageIdForTaskFn={messageIdForTask} mailSubject={mailSubject} /> :

                    <SideBar labelAdded={labelAdded} messageIdForTaskFn={messageIdForTask} removeCatchupLater={removeCatchupLater} updateLabelAdded={updateLabelAdded} mailSubject={mailSubject} mailUrl={mailUrl} />
                  )
              ) //1
                :
                (
                  <LandingPage onGoToPreviousPage={handleGoToPreviousPage} commingFromPrevComponent={commingFromPrevComponent}  />
                )

            ) //2
      }

    </div>
  )
}

export default OuterSidebar