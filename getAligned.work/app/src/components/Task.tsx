import "../css/taskN.css";
import calendarRed from "../assets/calendarRed.svg";
import redReminder from "../assets/redReminder.svg";

const TaskN = () => {
  return (
    <div className="outerDivOfTaskN">
        <div className="first">
        <input className="input1" type="text" placeholder="Task Name" />
        <input className="input2" type="text" placeholder="Description" />

        <div className="two">
        <button className="btn1"><img src={calendarRed} alt="" /> Due date</button>
        <button className="btn1">
            <img src={redReminder} alt="" />
            Reminders
        </button>
        <button className="btn1">
            <img src={calendarRed} alt="" />
            priority
        </button>
        </div>
        <div className="three">
        <button className="btn1">cancel</button>
        <button className="btn1">send</button>
        </div>
        </div>
    </div>
  )
}

export default TaskN