import "../css/sidebar.css";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import addSymbol from "../assets/addSymbol.svg";
import editSvg from "../assets/edit.svg";
import deleteSvg from "../assets/delete.svg";
import OPENFORM from "../assets/sidebar/openForm.svg";
import myTask from "../assets/myTask.svg";
import followUp from "../assets/followUp.svg";
import other from "../assets/other.svg";
import calendarRed from "../assets/calendarRed.svg";
import THREEDOT from "../assets/sidebar/ThreeDots.svg";
import Tooltip from '@mui/material/Tooltip';
import { Button, CircularProgress, Fade, MenuItem, MenuList, Modal, Popper, Select, Skeleton, Paper, Popover, Typography, Checkbox } from "@mui/material";
import CustomizedSnackbar from "@/snackBar/customizedSnackBar";
import CATCHUPLATERDELETE from "../assets/sidebar/catchuplaterDelete.svg";
import CATCHUPLATERADD from "../assets/sidebar/catchuplaterAdd.svg";
import CustomBackdrop from "@/components/CustomBackdrop";
import { CustomSlider } from "@/components/CustomSlider";
import BLUETICK from "../assets/sidebar/blueTick.svg";
import BLACKCLOSE from "../assets/sidebar/closeBlack.svg";
// import SvgIcon from '@mui/material/SvgIcon';
import { TESTING_URL } from "@/ApiLinks";
import NewTaskForm from "./NewTaskForm";
import DONE from "../assets/sidebar/done.svg";
import INPROGRESS from "../assets/sidebar/inprogress.svg";
import TODO from "../assets/sidebar/todo.svg";
import NewTaskEdit from "./NewTaskEdit";
import TaskEditForm from "./TaskEditForm";
// import TaskViewForm from "./TaskViewForm";
import CATCHUPLATERBLACK from "../assets/sidebar/catchuplaterBlack.svg";
import BACKTOHOME from "../assets/outersidebar/backToHome.svg";
import LandingPage from "./LandingPage";
import DROPDOWN from "../assets/LandingPage/dropDown.svg";
import DROPSIDE from "../assets/LandingPage/dropSide.svg";


export interface Tasks {
  id: number;
  title: string;
  deadline: Date;
  setReminders: { id: number; reminderTimestamp: string }[];
  taskType: { id: number; taskType: string };
  notes: any;
  taskStatus: { id: number; taskStatusName: string };
  progress: number;
  mailUrl: string;
}

function SideBar({ labelAdded, messageIdForTaskFn, updateLabelAdded, mailSubject, mailUrl }: any) {
  const [loading, setLoading] = useState(false); //loader
  console.log("mailSubject in sidebar to taskform", mailSubject, mailUrl);

  const [fetchedTasks, setFetchedTasks] = useState<Array<Tasks> | undefined>([]); //fetching tasks
  const [task, setTask] = useState(true); //fetched tasks stored

  const [____, setShowTaskForm] = useState<boolean>(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false); //snackbar
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('');

  const [deletePopoverAnchor, setDeletePopoverAnchor] = useState(null); //delete popover
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  const [openModalForCacthupRemove, setOpenModalForCacthupRemove] = useState(false); //for catchup delete modal

  // const [showCelebration, setShowCelebration] = useState<any>(""); //celebration gif

  const [_, setTaskCompleted] = useState(false);

  const [fetchedCompletedTasks, setFetchedCompletedTasks] = useState<Tasks[]>([] || null); //to store completed tasks
  const [showCompletedList, setShowCompletedList] = useState(false);
  const [clickedOnCompleted, setClickedOnCompleted] = useState(false);

  const fetchAllCompletedTasks = async () => {
    try {
      let res = await fetch(`${TESTING_URL}/api/v1/tasks/standard-email-id-and-status?standardEmailId=${messageIdForTaskFn}&status=COMPLETED`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('access')}`
        }
      })
      let result = await res.json();
      if (result && result.length > 0) {
        setFetchedCompletedTasks(result);
        initializeSelectedStatus2(result);
      }
      else {
        setFetchedCompletedTasks([]);
      }
    }
    catch (err) {
      console.error("falied to fetch all completed tasks", err);
    }
  }

  function handleCompltete() {
    setShowCompletedList(!showCompletedList);
    setClickedOnCompleted(!clickedOnCompleted);
    setTimeout(() => {
      const newTaskForm = document.getElementById("iii");
      if (newTaskForm) {
        newTaskForm.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        console.error('Element with id "iii" not found.');
      }
    }, 50);
  }


  const handleOpenModalForCacthupRemove = () => {
    setOpenModalForCacthupRemove(true);
  };

  const handleCloseModalForCacthupRemove = () => {
    setOpenModalForCacthupRemove(false);
  };

  // const ButtonControl = useMemo(() => {
  //   return (
  //     <IconButton
  //       sx={{ position: "absolute", top: "0px", right: "0px" }}
  //       onClick={handle_click_control}
  //       size="small"
  //       aria-label="close"
  //     >
  //       {sidebar_is_opened ? <img src={closeBlack} style={{ marginTop: "8px", marginRight: "10px" }} alt="" width={"100%"} /> : <OpenIcon />}
  //     </IconButton>
  //   );
  // }, [sidebar_is_opened]);


  // function handle_click_control() {
  //   set_sidebar_is_opened(!sidebar_is_opened);

  //   if (sidebar_is_opened) {
  //     window_send_message("parent", "handle_sidebar_close");
  //   } else {
  //     window_send_message("parent", "handle_sidebar_open");
  //   }
  // }

  const handleAdd = () => {
    setTask(false);
  }

  const closeTaskFormFn = () => {
    setTask(true);
  }

  const toRenderFn = () => {
    setTask(true);
    fetchingTasks();
  }

  const handleCancelView = () => {
    setTaskToEdit(null);
    setTask(true);
    setShowTaskForm(false);
    fetchingTasks();
  }


  useEffect(() => {
    const fetchData = async () => {
      await fetchingTasks();
      await fetchAllCompletedTasks();
    };
    fetchData();
  }, [])


  const formatDeadlineForUi = (deadline: any) => {
    const currentDate = new Date();
    const deadlineDate = new Date(deadline);

    // Check if the deadline is today
    if (
      deadlineDate.getDate() === currentDate.getDate() &&
      deadlineDate.getMonth() === currentDate.getMonth() &&
      deadlineDate.getFullYear() === currentDate.getFullYear()
    ) {
      return `Today ${deadlineDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    }

    // Check if the deadline is tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(currentDate.getDate() + 1);
    if (
      deadlineDate.getDate() === tomorrow.getDate() &&
      deadlineDate.getMonth() === tomorrow.getMonth() &&
      deadlineDate.getFullYear() === tomorrow.getFullYear()
    ) {
      return `Tomorrow ${deadlineDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    }

    // Check if the deadline is within one week
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(currentDate.getDate() + 7);
    if (
      deadlineDate > currentDate &&
      deadlineDate <= oneWeekFromNow
    ) {
      return `${deadlineDate.toLocaleDateString('en-US', { weekday: 'long' })} ${deadlineDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    }

    // Deadline is not within this week
    return `${deadlineDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}, ${deadlineDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  };

  //snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSnackbar = (message: string, severity: any) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };


  const handleCheckBox = async (taskId: number) => {

    try {
      setLoading(true);
      const response = await fetch(`${TESTING_URL}/api/v1/tasks/complete?taskId=${taskId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("access")}`
        }
      });
      const res = await response.json();
      console.log("handleCheck res", res);
      if (res.taskStatus.id == 2) {
        console.log("Task completed successfully",);
        setLoading(false);
        fetchingTasks();
        fetchAllCompletedTasks();
        handleSnackbar("Task completed!!", "success");  //snackBar
      }
      else if (res.taskStatus.id == 4) {
        setLoading(false)
        fetchingTasks();
        handleSnackbar("Task Overdue", "warning");  //snackBar
      }
    } catch (error) {
      setLoading(false);
      handleSnackbar("Error completing task", "error");  //snackBar
      console.error("Network error:", error);
    }
  };


  //for delete popover
  const handleOpenDeletePopover = (taskId: any) => (event: any) => {
    setDeletingTaskId(taskId);
    console.log("event here", event.currentTarget);
    setDeletePopoverAnchor(event.currentTarget);
  };

  const handleCloseDeletePopover = () => {
    setAnchorElOfThreeDots(null);
    setOpenPopOfThreeDots(false);
    setDeletePopoverAnchor(null);
    setDeletingTaskId(null);
  };

  const handleConfirmDelete = async () => {
    setButtonLoading(true);
    try {
      const response = await fetch(`${TESTING_URL}/api/v1/tasks?taskId=${deletingTaskId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access")}`
        }
      })
      const resDtata = await response.json();
      console.log("res Delete", deletingTaskId, resDtata);
      fetchingTasks(); // Fetch tasks again to update UI
      fetchAllCompletedTasks();
      handleCloseDeletePopover();
      handleSnackbar("Task deleted", "success");
      setTimeout(() => {
      }, 1000)
      setButtonLoading(false);
    }
    catch (err) {
      setButtonLoading(false);
      handleSnackbar("Failed to deletete the task", "error");
      console.log("error deleting task", err);
    }

  };

  //to remove from catchup
  const handleRemoveFromCatchup = async () => {
    setButtonLoading(true);
    try {
      let res = await fetch(`${TESTING_URL}/api/v1/emails/catch-up-later-emails?email_id=${messageIdForTaskFn}`, {
        "method": "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('access')}`
        }
      })
      let result = await res.json();
      handleSnackbar("Removed from catchup", "success");
      // removeCatchupLater();
      updateLabelAdded(false);
      setButtonLoading(false);
      handleCloseModalForCacthupRemove();
      console.log("removed from cpltr", result);
    }
    catch (err) {
      setButtonLoading(false);
      handleSnackbar("Cannot remove from catchup", "warning");
      console.log("error removing from catchup", err);
    }
  }

  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

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

  //to add to catchup
  const handleAddToCatchup = async () => {
    setButtonLoading(true);
    setButtonDisabled(true);
    try {
      const formattedDate = formatCustomDate();
      const response = await fetch(`${TESTING_URL}/api/v1/emails/catch-up-later-emails`, {
        method: "POST",
        body: JSON.stringify({ standardEmailId: messageIdForTaskFn, title: mailSubject, createdDate: formattedDate, mailUrl: mailUrl }),
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${localStorage.getItem("access")}`
        }
      })
      const data = await response.json();
      handleSnackbar("Added to catchup later", "success");
      console.log("handleCatchupLater response", data);
      updateLabelAdded(true);
      handleCloseModalForCacthupRemove();
      setButtonLoading(false);
      setButtonDisabled(false);
    }
    catch (err) {
      setButtonLoading(false);
      setButtonDisabled(false);
      handleSnackbar("Error adding to catchup later", "error");
      console.log("error from handleCatchupLaterFn outersidebar", err);
    }
  }

  //slider
  const [sliderValues, setSliderValues] = useState<{ [taskId: number]: number }>({});
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);

  const handleSliderChange = (taskId: number) => (_: any, newValue: any) => {
    setSliderValues(prevState => ({
      ...prevState,
      [taskId]: newValue
    }));
    setActiveTaskId(taskId);
  };
  // console.log(sliderValues);

  const handleSliderCancel = () => {
    setActiveTaskId(null);
  };

  const handleTaskComplete = async (taskId: number, progress: number) => {
    console.log("ss", taskId, progress);
    try {
      setLoading(true);
      const response = await fetch(`${TESTING_URL}/api/v1/tasks/progress?taskId=${taskId}&progress=${progress}`, {
        method: 'PUT', // Assuming it's a PUT request to update progress
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("access")}`
        }
      });
      const res = await response.json();
      if (res) {
        console.log('Task progress updated successfully', res);
        setActiveTaskId(null);
        setLoading(false);
        if (progress === 100) {
          handleCheckBox(taskId);
          setTaskCompleted(true);
          console.log("set", taskId);
        }
      }
       else {
        setLoading(false);
        console.error('Failed to update task progress:', response.statusText);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error updating task progress:', error);
    }
  };

  console.log("label added in sidebar", labelAdded)


  //status dropdown
  const [selectedStatusMap, setSelectedStatusMap] = useState<{ [key: number]: string }>({});
  const [selectedStatusMap2, setSelectedStatusMap2] = useState<{ [key: number]: string }>({});

  const fetchingTasks = async () => {
    setLoading(true);
    try {
      console.log("msgId", messageIdForTaskFn)
      const response = await fetch(`${TESTING_URL}/api/v1/tasks/standard-email-id-not-completed?standardEmailId=${messageIdForTaskFn}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("access")}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Tasks:", data);
        setLoading(false);

        const newSliderValues: { [key: number]: number } = {};
        data.forEach((ele: any) => {
          newSliderValues[ele.id] = ele.progress || 0;
        });
        setSliderValues(newSliderValues);
        initializeSelectedStatus(data);
        setFetchedTasks(data);
      } else {

        console.error("Error fetching tasks:", response.statusText);
        return null;
      }
    } catch (error) {

      setLoading(false);
      console.error("Network error:", error);
      return null;
    }
  };

  const initializeSelectedStatus = (tasks: any[]) => {
    const initialSelectedStatusMap: { [key: number]: string } = {};
    tasks.forEach((task: any) => {
      initialSelectedStatusMap[task.id] = task.taskStatus.id === 1 ? 'inProgress' : task.taskStatus.id === 3 ? 'Todo' : 'completed';
    });
    setSelectedStatusMap(initialSelectedStatusMap);
  };

  const initializeSelectedStatus2 = (tasks: any[]) => {
    const initialSelectedStatusMap: { [key: number]: string } = {};
    tasks.forEach((task: any) => {
      initialSelectedStatusMap[task.id] = task.taskStatus.id === 1 ? 'inProgress' : task.taskStatus.id === 3 ? 'Todo' : 'completed';
    });
    setSelectedStatusMap2(initialSelectedStatusMap);
  };


  const handleStatusChange = (taskId: any, selectedStatus: any) => {
    setSelectedStatusMap(prevState => ({
      ...prevState, [taskId]: selectedStatus
    }));
    if (selectedStatus === "completed") {
      handleTaskComplete(taskId, 100);
    }
    else {
      handleChangeToInProgress(taskId);
    }
  };

  const handleStatusChange2 = (taskId: any, selectedStatus: any) => {
    setSelectedStatusMap2(prevState => ({
      ...prevState, [taskId]: selectedStatus
    }));
    if (selectedStatus === "completed") {
      handleTaskComplete(taskId, 100);
    }
    else {
      handleChangeToInProgress(taskId);
    }
  };

  const handleChangeToInProgress = async (taskId: any) => {
    try {
      const response = await fetch(`${TESTING_URL}/api/v1/tasks/status?taskId=${taskId}&masterTaskStatusId=1`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("access")}`
        }
      });
      const res = await response.json();
      if (res) {
        setHoveredTaskId(null);
        setActiveTaskId(null);
        console.log('Task converted to in progress successfully', res);
        fetchingTasks();
        fetchAllCompletedTasks();
      } else {
        console.log('Failed to convert to Inprogress task progress:', response.statusText);
      }
    }
    catch (error) {
      console.log('Error converting to inprogress', error);
    }
  }

  // State variable to track hovered task ID
  const [hoveredTaskId, setHoveredTaskId] = useState(null);

  // Function to handle task card hover
  const handleTaskCardHover = (taskId: any) => {
    setHoveredTaskId(taskId);
  };

  // Function to handle task card unhover
  const handleTaskCardUnhover = () => {
    setHoveredTaskId(null);
    setOpenPopOfThreeDots(false);
    //to cancel the popover of the delete
    setDeletePopoverAnchor(null);
    setDeletingTaskId(null);
  };

  // console.log("hoveredTaskId", hoveredTaskId);

  const [openPopOfThreeDots, setOpenPopOfThreeDots] = useState(false);
  const [anchorElOfThreeDots, setAnchorElOfThreeDots] = useState(null);
  const [editTaskId, setEditTaskId] = useState<Tasks | null>(null);

  // Function to toggle Popper and set anchor element
  const handleToggleToShowThreeDots = (taskId: any, event: any) => {
    setOpenPopOfThreeDots(openPopOfThreeDots === taskId ? null : taskId);
    setAnchorElOfThreeDots(event.currentTarget);
  };


  const handleEditTaskNew = (task: Tasks) => {
    setOpenPopOfThreeDots(false);
    setAnchorElOfThreeDots(null);
    setEditTaskId(task);
  }

  const closeTaskFormEdit = () => {
    setEditTaskId(null);
  }

  const submitTaskFormEdit = () => {
    setEditTaskId(null);
    fetchingTasks();
  }

  const [taskToEdit, setTaskToEdit] = useState<Tasks | null>(null); // State to hold task to edit
  const [openModal, setOpenModal] = useState(false); // State variable for the modal

  // Function to handle opening the modal
  const handleOpenTaskForm = (task: Tasks) => {
    setTaskToEdit(task);
    setOpenPopOfThreeDots(false);
    setHoveredTaskId(null);
    setOpenModal(true);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };


  console.log("task", task);
  console.log("singleTask", editTaskId);

  const [isMailOpened, setIsMailOpenend] = useState(false);

  const handleBackToHome = () => {
    setIsMailOpenend(true);
  }

  const handleGoToPreviousPage = () => {
    setIsMailOpenend(false);
  };


  const handleClickOfCheckbox = () => {

  }

  return (
    <>
      <CustomizedSnackbar
        open={snackbarOpen}
        handleClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />


      <Box className="sidebar"
        sx={{
          position: "relative",
          marginRight: "6px",
          // border: "0.5px solid black",
          //  borderBottom:"none",
          // padding:"0 10px",
        }} >

        <>
          {
            //this img will be shown in #label/catchup when label is removed there 
            isMailOpened ? <LandingPage onGoToPreviousPage={handleGoToPreviousPage} />

              :
              (
                <>

                  <div className="backToHome" onClick={handleBackToHome}>
                    <Tooltip title="Back to home">
                      <img src={BACKTOHOME} alt="" />
                    </Tooltip>
                  </div>

                  {
                    labelAdded &&
                    <div className="catchupShowInitiallyDiv">
                      <div>
                        <Checkbox color="success" size="small" onClick={handleClickOfCheckbox} />
                      </div>
                      <div>
                        <p>{mailSubject}</p>
                        <div className="catchupShowInitiallyInnerDiv">
                          <img src={CATCHUPLATERBLACK} alt="" />
                          Catch Up Later
                        </div>
                      </div>
                    </div>
                  }

                  {/* form datas fetched that i have to show */}

                  {
                    loading ? (
                      <>
                        <Skeleton animation="wave" width={280} height={300} style={{ marginLeft: "10px" }} />
                        <Skeleton animation="wave" width={280} height={300} style={{ marginLeft: "10px", marginTop: "-80px" }} />

                      </>
                    )
                      : (

                        fetchedTasks && fetchedTasks.length > 0 ? (
                          <main>

                            {
                              !task &&
                              // <TaskForm onCancel={handleCancel} messageIdForTaskFn={messageIdForTaskFn} mailSubject={mailSubject} />
                              <NewTaskForm messageIdForTaskFn={messageIdForTaskFn} mailSubject={mailSubject} closeTaskForm={closeTaskFormFn} toRender={toRenderFn} mailUrl={mailUrl} />
                            }

                            {
                              task &&
                              <section>
                                <Box display={"flex"} justifyContent={"center"} mt={"1.3rem"} borderRadius={"4px"} alignItems={"center"}>
                                  <Box className="add_task_buttonSidebar" onClick={handleAdd} >
                                    <img className="addImage" src={addSymbol} alt="add" />
                                    <p style={{ marginRight: "10px", fontWeight: "500", fontSize: "13px", color: "2196F3" }}>Add Task</p>
                                  </Box>
                                </Box>
                              </section>
                            }
                            <Box className="mainOuterBox">
                              {
                                fetchedTasks?.map((ele) => {
                                  return <div className={`taskOuterDiv`} key={ele.id} onMouseEnter={() => { handleTaskCardHover(ele.id) }} onMouseLeave={handleTaskCardUnhover}>

                                    {editTaskId?.id == ele.id ? (
                                      <NewTaskEdit task={editTaskId} closeTaskFormEdit={closeTaskFormEdit} submitTaskFormEdit={submitTaskFormEdit} />
                                    ) : (
                                      <>
                                        <div className="taskWrapper">

                                          <div className="checkboxDivSB">
                                            <Tooltip title="complete task" >
                                            <Checkbox size="small" color="success" className="checkboxSB" onClick={() => { handleTaskComplete(ele.id, 100) }} />
                                            </Tooltip>
                                          </div>

                                          <div className="taskWrapper1">

                                            {/* firstInnerDiv */}

                                            <div className="FirstInnerDiv Common">
                                              <div> {ele.title}</div>

                                              {
                                                hoveredTaskId === ele.id &&
                                                <>
                                                  <div className="ThreeDotsDiv" onClick={(event) => handleToggleToShowThreeDots(ele.id, event)}>
                                                    <img src={THREEDOT} alt="" />
                                                  </div>

                                                  {openPopOfThreeDots && (
                                                    <Popper open={openPopOfThreeDots} anchorEl={anchorElOfThreeDots} placement="left-start">
                                                      <Paper>
                                                        <MenuList>
                                                          <MenuItem className="MenuListOfThreeDots" onClick={() => handleEditTaskNew(ele)}><img src={editSvg} className="PopperImage" alt="" /> Edit</MenuItem>
                                                          <MenuItem className="MenuListOfThreeDots" onClick={() => handleOpenTaskForm(ele)}><img src={OPENFORM} className="PopperImage" alt="" />Open Form</MenuItem>
                                                          <MenuItem className="MenuListOfThreeDots DeleteMenulistDiv" onClick={handleOpenDeletePopover(ele.id)}><img src={deleteSvg} className="PopperImage" alt="" /> Delete</MenuItem>
                                                        </MenuList>
                                                      </Paper>
                                                    </Popper>
                                                  )}
                                                  {/* popover for delete */}
                                                  <Popover
                                                    open={Boolean(deletePopoverAnchor)}
                                                    anchorEl={deletePopoverAnchor}
                                                    onClose={handleCloseDeletePopover}
                                                    anchorOrigin={{
                                                      vertical: 'bottom',
                                                      horizontal: 'right',
                                                    }}
                                                    transformOrigin={{
                                                      vertical: 'top',
                                                      horizontal: 'right',
                                                    }}
                                                    PaperProps={{
                                                      style: {
                                                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                                      },
                                                    }}
                                                  >
                                                    <Box p={2} className="outerBoxOfDelete">
                                                      <Typography>Confirm task deletion?</Typography>
                                                      <Box className="cancelTaskDiv">
                                                        <button onClick={handleCloseDeletePopover} className="cancelButton">
                                                          Cancel
                                                        </button>
                                                        <button className="deleteButton" onClick={handleConfirmDelete} disabled={buttonLoading} >
                                                          {buttonLoading ? <CircularProgress size={20} style={{ color: 'white', marginTop: "2px" }} /> : "Delete"}
                                                        </button>
                                                      </Box>
                                                    </Box>
                                                  </Popover>

                                                </>
                                              }

                                            </div>

                                            {/* secondInnerDiv */}

                                            <div className="SecondInnerDiv Common">
                                              {ele.notes}
                                            </div>

                                            {/* thirdInnerDiv */}

                                            <div className="ThirdInnerDiv">
                                              {
                                                ele.deadline &&
                                                <div className="ThirdInnerDiv1">
                                                  <img src={calendarRed} width={"16px"} alt="" />
                                                  <span className="ThirdInnerDivTitle1">{formatDeadlineForUi(ele.deadline)}</span>
                                                </div>
                                              }

                                              <div className="ThirdInnerDiv2">
                                                {ele.taskType.id === 1 ? (
                                                  <div className="ThirdInnerDivTasktype">
                                                    <img src={myTask} alt="Task 1" />
                                                    <p className="ThirdInnerDivTitle2">{ele.taskType.taskType}</p>
                                                  </div>
                                                ) : ele.taskType.id === 2 ? (
                                                  <div className="ThirdInnerDivTasktype">
                                                    <img src={followUp} alt="Task 2" />
                                                    <p className="ThirdInnerDivTitle2">{ele.taskType.taskType}</p>
                                                  </div>
                                                ) : (
                                                  <div className="ThirdInnerDivTasktype">
                                                    <img src={other} alt="Task 3" />
                                                    <p className="ThirdInnerDivTitle2">{ele.taskType.taskType}</p>
                                                  </div>
                                                )}
                                              </div>

                                            </div>


                                            {/* fifthInnerDiv Slider */}

                                            {
                                              hoveredTaskId === ele.id &&
                                              ele.taskStatus.id == 1 &&
                                              <div className={`thirdInnerDiv ${hoveredTaskId === ele.id ? 'show' : ''}`}>

                                                <CustomSlider value={sliderValues[ele.id] || 0} onChange={handleSliderChange(ele.id)} />

                                                <div className="thirdInnerDivInner">
                                                  <p>{sliderValues[ele.id] || 0}% task completed</p>
                                                  {activeTaskId === ele.id && (
                                                    <div className="thirdInnerDivInner1">
                                                      <Tooltip title="Done">
                                                        <img src={BLUETICK} onClick={() => handleTaskComplete(ele.id, sliderValues[ele.id] || 0)} alt="" />
                                                      </Tooltip>
                                                      <Tooltip title="cancel">
                                                        <img onClick={handleSliderCancel} src={BLACKCLOSE} alt="" />
                                                      </Tooltip>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            }
                                          </div>
                                        </div>

                                        {/* sixthInnerDiv */}
                                        <div className="SixthInnerDiv">
                                          <div className="borderLine"></div>
                                          <div>
                                            <Select className="selectTaskTypee"
                                              value={selectedStatusMap[ele.id]}
                                              onChange={(e) => handleStatusChange(ele.id, e.target.value)}
                                              sx={{
                                                boxShadow: "none",
                                                ".MuiOutlinedInput-notchedOutline": { border: 0 },
                                                "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                                                {
                                                  border: 0,
                                                },
                                                "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                                                {
                                                  border: 0,
                                                },
                                                // border: '1px solid black',
                                                fontWeight: "500",
                                                borderRadius: "4px",
                                                marginLeft: "5px"
                                              }}
                                              renderValue={(selected) => (
                                                selected === 'Todo' ? (
                                                  <span className="imageOfStatus">
                                                    <img src={TODO} alt="" style={{ marginRight: '8px' }} />To-do
                                                  </span>
                                                ) :
                                                  selected === 'inProgress' ? (
                                                    <span className="imageOfStatus">
                                                      <img src={INPROGRESS} alt="" style={{ marginRight: '8px' }} />In Progress
                                                    </span>
                                                  ) :
                                                    selected === 'completed' ? (
                                                      <span className="imageOfStatus">
                                                        <img src={DONE} alt="" style={{ marginRight: '8px' }} />Completed
                                                      </span>
                                                    ) :
                                                      ''
                                              )}
                                            >
                                              <MenuItem value="Todo" disabled className="MenuItem"><img src={TODO} alt="" />To-do</MenuItem>
                                              <MenuItem value="inProgress" className="MenuItem"><img src={INPROGRESS} alt="" />In Progress</MenuItem>
                                              <MenuItem value="completed" className="MenuItem"><img src={DONE} alt="" /> Completed</MenuItem>
                                            </Select>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </div>

                                })
                              }

                            </Box>
                          </main>

                        )
                          : (

                            labelAdded ?

                              !task ?
                                <NewTaskForm messageIdForTaskFn={messageIdForTaskFn} mailSubject={mailSubject} closeTaskForm={closeTaskFormFn} toRender={toRenderFn} mailUrl={mailUrl} /> :

                                task &&
                                <section>
                                  <Box display={"flex"} justifyContent={"center"} mt={"1.3rem"} borderRadius={"4px"} alignItems={"center"}>
                                    <Box className="add_task_buttonSidebar" onClick={handleAdd} >
                                      <img className="addImage" src={addSymbol} alt="add" />
                                      <p style={{ marginRight: "10px", fontWeight: "500", fontSize: "13px", color: "2196F3" }}>Add Task</p>
                                    </Box>
                                  </Box>
                                </section>

                              :

                              <NewTaskForm messageIdForTaskFn={messageIdForTaskFn} mailSubject={mailSubject} toRender={toRenderFn} mailUrl={mailUrl} />
                          )

                      )}


                  {/* show completed tasks */}
                  <div className="outerLP" >
                    {
                      //  fetchedCompletedTasks.length > 0 &&
                      <div className="completedDropDown">
                        <div className="middleLine"></div>
                        <div className="completedDivLP" onClick={handleCompltete}>
                          {
                            clickedOnCompleted ? <img src={DROPDOWN} alt="" /> : <img src={DROPSIDE} alt="" />
                          }
                          <p>completed ({fetchedCompletedTasks.length})</p>
                        </div>
                      </div>
                    }

                    {
                      showCompletedList && (
                        <div id="iii">
                          {
                            fetchedCompletedTasks?.map((ele) => (
                              <div key={ele.id}>
                                <div className={`taskOuterDiv`} key={ele.id} onMouseEnter={() => { handleTaskCardHover(ele.id) }} onMouseLeave={handleTaskCardUnhover}>

                                  {editTaskId?.id == ele.id ? (
                                    <NewTaskEdit task={editTaskId} closeTaskFormEdit={closeTaskFormEdit} submitTaskFormEdit={submitTaskFormEdit} />
                                  ) : (
                                    <>
                                      <div className="taskWrapper">

                                        <div className="checkboxDivSB">
                                          <Tooltip title="In progress">
                                          <Checkbox size="small" color="info" className="checkboxSB" onClick={() => { handleChangeToInProgress(ele.id) }} />
                                          </Tooltip>
                                        </div>

                                        <div className="taskWrapper1">
                                          {/* firstInnerDiv */}

                                          <div className="FirstInnerDiv Common">
                                            <div> {ele.title}</div>

                                            {
                                              hoveredTaskId === ele.id &&
                                              <>
                                                <div className="ThreeDotsDiv" onClick={(event) => handleToggleToShowThreeDots(ele.id, event)}>
                                                  <img src={THREEDOT} alt="" />
                                                </div>

                                                {openPopOfThreeDots && (
                                                  <Popper open={openPopOfThreeDots} anchorEl={anchorElOfThreeDots} placement="left-start">
                                                    <Paper>
                                                      <MenuList>
                                                        <MenuItem className="MenuListOfThreeDots" onClick={() => handleEditTaskNew(ele)}><img src={editSvg} className="PopperImage" alt="" /> Edit</MenuItem>
                                                        <MenuItem className="MenuListOfThreeDots" onClick={() => handleOpenTaskForm(ele)}><img src={OPENFORM} className="PopperImage" alt="" />Open Form</MenuItem>
                                                        <MenuItem className="MenuListOfThreeDots DeleteMenulistDiv" onClick={handleOpenDeletePopover(ele.id)}><img src={deleteSvg} className="PopperImage" alt="" /> Delete</MenuItem>
                                                      </MenuList>
                                                    </Paper>
                                                  </Popper>
                                                )}
                                                {/* popover for delete */}
                                                <Popover
                                                  open={Boolean(deletePopoverAnchor)}
                                                  anchorEl={deletePopoverAnchor}
                                                  onClose={handleCloseDeletePopover}
                                                  anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'right',
                                                  }}
                                                  transformOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right',
                                                  }}
                                                  PaperProps={{
                                                    style: {
                                                      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                                    },
                                                  }}
                                                >
                                                  <Box p={2} className="outerBoxOfDelete">
                                                    <Typography>Confirm task deletion?</Typography>
                                                    <Box className="cancelTaskDiv">
                                                      <button onClick={handleCloseDeletePopover} className="cancelButton">
                                                        Cancel
                                                      </button>
                                                      <button className="deleteButton" onClick={handleConfirmDelete} disabled={buttonLoading} >
                                                        {buttonLoading ? <CircularProgress size={20} style={{ color: 'white', marginTop: "2px" }} /> : "Delete"}
                                                      </button>
                                                    </Box>
                                                  </Box>
                                                </Popover>

                                              </>
                                            }

                                          </div>

                                          {/* secondInnerDiv */}

                                          <div className="SecondInnerDiv Common">
                                            {ele.notes}
                                          </div>

                                          {/* thirdInnerDiv */}

                                          <div className="ThirdInnerDiv">
                                            {
                                              ele.deadline &&
                                              <div className="ThirdInnerDiv1">
                                                <img src={calendarRed} width={"16px"} alt="" />
                                                <span className="ThirdInnerDivTitle1">{formatDeadlineForUi(ele.deadline)}</span>
                                              </div>
                                            }

                                            <div className="ThirdInnerDiv2">
                                              {ele.taskType.id === 1 ? (
                                                <div className="ThirdInnerDivTasktype">
                                                  <img src={myTask} alt="Task 1" />
                                                  <p className="ThirdInnerDivTitle2">{ele.taskType.taskType}</p>
                                                </div>
                                              ) : ele.taskType.id === 2 ? (
                                                <div className="ThirdInnerDivTasktype">
                                                  <img src={followUp} alt="Task 2" />
                                                  <p className="ThirdInnerDivTitle2">{ele.taskType.taskType}</p>
                                                </div>
                                              ) : (
                                                <div className="ThirdInnerDivTasktype">
                                                  <img src={other} alt="Task 3" />
                                                  <p className="ThirdInnerDivTitle2">{ele.taskType.taskType}</p>
                                                </div>
                                              )}
                                            </div>

                                          </div>


                                          {/* fifthInnerDiv Slider */}

                                          {
                                            hoveredTaskId === ele.id &&
                                            ele.taskStatus.id == 1 &&
                                            <div className={`thirdInnerDiv ${hoveredTaskId === ele.id ? 'show' : ''}`}>

                                              <CustomSlider value={sliderValues[ele.id] || 0} onChange={handleSliderChange(ele.id)} />

                                              <div className="thirdInnerDivInner">
                                                <p>{sliderValues[ele.id] || 0}% task completed</p>
                                                {activeTaskId === ele.id && (
                                                  <div className="thirdInnerDivInner1">
                                                    <Tooltip title="Done">
                                                      <img src={BLUETICK} onClick={() => handleTaskComplete(ele.id, sliderValues[ele.id] || 0)} alt="" />
                                                    </Tooltip>
                                                    <Tooltip title="cancel">
                                                      <img onClick={handleSliderCancel} src={BLACKCLOSE} alt="" />
                                                    </Tooltip>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          }
                                      </div>
                                      </div>
                                          {/* sixthInnerDiv */}
                                          <div className="SixthInnerDiv">
                                            <div className="borderLine"></div>
                                            <div>
                                              <Select className="selectTaskTypee"
                                                value={selectedStatusMap2[ele.id]}
                                                onChange={(e) => handleStatusChange2(ele.id, e.target.value)}
                                                sx={{
                                                  boxShadow: "none",
                                                  ".MuiOutlinedInput-notchedOutline": { border: 0 },
                                                  "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                                                  {
                                                    border: 0,
                                                  },
                                                  "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                                                  {
                                                    border: 0,
                                                  },
                                                  // border: '1px solid black',
                                                  fontWeight: "500",
                                                  borderRadius: "4px",
                                                  marginLeft: "5px"
                                                }}
                                                renderValue={(selected) => (
                                                  selected === 'Todo' ? (
                                                    <span className="imageOfStatus">
                                                      <img src={TODO} alt="" style={{ marginRight: '8px' }} />To-do
                                                    </span>
                                                  ) :
                                                    selected === 'inProgress' ? (
                                                      <span className="imageOfStatus">
                                                        <img src={INPROGRESS} alt="" style={{ marginRight: '8px' }} />In Progress
                                                      </span>
                                                    ) :
                                                      selected === 'completed' ? (
                                                        <span className="imageOfStatus">
                                                          <img src={DONE} alt="" style={{ marginRight: '8px' }} />Completed
                                                        </span>
                                                      ) :
                                                        ''
                                                )}
                                              >
                                                <MenuItem value="Todo" disabled className="MenuItem"><img src={TODO} alt="" />To-do</MenuItem>
                                                <MenuItem value="inProgress" className="MenuItem"><img src={INPROGRESS} alt="" />In Progress</MenuItem>
                                                <MenuItem value="completed" className="MenuItem"><img src={DONE} alt="" /> Completed</MenuItem>
                                              </Select>
                                            </div>
                                          </div>
                                        </>
                                  )}
                                      </div>
                                    </div>
                                  ))
                          }
                                </div>
                                )
                    }
                              </div>


                  {
                                labelAdded?(<div className = "catchupLaterDeleteDiv" >
                                  <Tooltip title="Remove from catchup">
                                    <img src={CATCHUPLATERDELETE} onClick={handleOpenModalForCacthupRemove} alt="" />
                                  </Tooltip>
                    </div>) :

                    <div className="catchupLaterAddDiv" >
                      <Tooltip title="Add to catchup later">
                        <img src={CATCHUPLATERADD} onClick={handleOpenModalForCacthupRemove} alt="" />
                      </Tooltip>
                    </div>
                  }

                    {
                      taskToEdit &&
                      <Modal
                        open={openModal}
                        onClose={handleCloseModal}
                        aria-labelledby="form-modal"
                        aria-describedby="form-modal-description"
                        closeAfterTransition
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        components={{
                          // Backdrop: CustomBackdrop2,
                        }}
                      >
                        <div style={{ width: '95%' }}>

                          {/* {taskToEdit ? <TaskViewForm task={taskToEdit} onCancelView={handleCancelView} /> : <></>} */}
                          {taskToEdit ? <TaskEditForm task={taskToEdit} onCancelView={handleCancelView} /> : <></>}
                        </div>
                      </Modal>

                    }

                    {
                      labelAdded ? (
                        <Modal
                          open={openModalForCacthupRemove}
                          onClose={handleCloseModalForCacthupRemove}
                          aria-labelledby="modal-title"
                          aria-describedby="modal-description"
                          closeAfterTransition
                          components={{
                            Backdrop: CustomBackdrop,
                          }}
                        >
                          <Fade in={openModalForCacthupRemove}>
                            <div className="catchuLaterRemoveModalDiv">
                              <p id="modal-description">Do you want to remove this mail from catchup later?</p>
                              <div>
                                <Button className="catchupRemoveBtn1" onClick={handleCloseModalForCacthupRemove}>Cancel</Button>
                                <Button className="catchupRemoveBtn2" onClick={handleRemoveFromCatchup} disabled={buttonLoading}> {buttonLoading ? <CircularProgress size={24} style={{ color: 'white' }} /> : "Remove"}</Button>
                              </div>
                            </div>
                          </Fade>
                        </Modal>
                      ) : (
                        <Modal
                          open={openModalForCacthupRemove}
                          onClose={handleCloseModalForCacthupRemove}
                          aria-labelledby="modal-title"
                          aria-describedby="modal-description"
                          closeAfterTransition
                          components={{
                            Backdrop: CustomBackdrop,
                          }}
                        >
                          <Fade in={openModalForCacthupRemove}>
                            <div className="catchuLaterRemoveModalDiv">
                              <p id="modal-description">Do you want to add this mail to catchup later?</p>
                              <div>
                                <Button className="catchupRemoveBtn1" onClick={handleCloseModalForCacthupRemove}>Cancel</Button>
                                <Button className={`catchupAddBtn2 ${buttonLoading ? 'loading' : ''}`} onClick={handleAddToCatchup} disabled={buttonLoading}>
                                  {buttonDisabled ? (<> <div className="loader-icon"></div>
                                  </>) : (
                                    <>
                                      <span>Add</span>
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </Fade>
                        </Modal>
                      )
                    }
                  </>

                  )

          }

                </>


      </Box >

      </>
      );
}

      export default SideBar;

