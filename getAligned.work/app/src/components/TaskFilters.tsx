import { Button } from "@mui/material";
import "../css/taskfilter.css";
import { useState } from "react";

interface TaskFiltersProps {
  onFilterChange: (params: any) => void; 
}

interface ApiParams {
  statusIds: string;
  typeIds: string;
  progress: string;
  standardEmailId?: string; // Make standardEmailId optional
}

const TaskFilters = ({onFilterChange}: TaskFiltersProps) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleFilterClick = (filter: string) => {
    setActiveFilters((prevActiveFilters) => {
      // Toggle the filter
      let newActiveFilters = [...prevActiveFilters];
  
      if (newActiveFilters.includes(filter)) {
        newActiveFilters = newActiveFilters.filter((ele: string) => ele !== filter);
      } else {
        newActiveFilters.push(filter);
      }
  
      // Map filter values to API parameter values
      const statusIdsMap: { [key: string]: number } = {
        "In Progress": 1,
        "Completed": 2,
        "Overdue": 4,
      };
      const typeIdsMap: { [key: string]: number } = {
        "My Task": 1,
        "Follow up": 2,
        "Others": 3,
      };
      const progressMap: { [key: string]: number } = {
        "Below 50%": 50,
        "Below 100%": 100,
      };
      const emailAssigedMap : { [key: string]: string } = {
        "Email Assigned":"something",
      }
  
      // Convert selected filter values to API parameters
      const statusIds = newActiveFilters
        .filter((filter) => statusIdsMap.hasOwnProperty(filter))
        .map((filter) => statusIdsMap[filter]);
      const typeIds = newActiveFilters
        .filter((filter) => typeIdsMap.hasOwnProperty(filter))
        .map((filter) => typeIdsMap[filter]);
      const progress = newActiveFilters
        .filter((filter) => progressMap.hasOwnProperty(filter))
        .map((filter) => progressMap[filter]);
      const standard = newActiveFilters
        .filter((filter) => emailAssigedMap.hasOwnProperty(filter))
        .map((filter) => emailAssigedMap[filter]);



        let progressToSend: string | undefined;

        // Check if both "Below 50%" and "Below 100%" are selected
        const bothSelected = newActiveFilters.includes("Below 50%") && newActiveFilters.includes("Below 100%");
        if (bothSelected) {
          // If both are selected, send "100"
          progressToSend = progressMap["Below 100%"].toString();
        } else {
          // If only "Below 50%" or "Below 100%" is selected, send the selected value
          progressToSend = progress.join(",") || undefined;
        }
  
      // Construct API parameters object
      const apiParams: ApiParams = {
        statusIds: statusIds.join(","),
        typeIds: typeIds.join(","),
        progress: progressToSend || "",
      };
       // Add standardEmailId to API parameters if standard filters are active
    if (standard.length > 0) {
      apiParams.standardEmailId = standard.join(",");
    }
  
      console.log("activeFilters", newActiveFilters);
      console.log("apiParams", apiParams);
  
      // Pass the API parameters to the parent component
      onFilterChange(apiParams);
  
      return newActiveFilters;
    });
  };
  
  
  
  return (
    <>
      <div className="taskFilterOuterDiv">
        {/* <Button
          className={activeFilters.includes("All") ? "includes" : "notIncludes"}
          onClick={() => handleFilterClick("All")}>
          All
        </Button> */}

        <Button className={activeFilters.includes("Email Assigned") ? "includes" : "notIncludes"}
          onClick={() => handleFilterClick("Email Assigned")}>
          Email Associated
          </Button>
          
        <Button className={activeFilters.includes("My Task") ? "includes" : "notIncludes"}
          onClick={() => handleFilterClick("My Task")}>My task</Button>

        <Button className={activeFilters.includes("Follow up") ? "includes" : "notIncludes"}
          onClick={() => handleFilterClick("Follow up")}> Follow up</Button>

        <Button className={activeFilters.includes("Others") ? "includes" : "notIncludes"}
          onClick={() => handleFilterClick("Others")}>Others</Button>

        <Button className={activeFilters.includes("In Progress") ? "includes" : "notIncludes"}
          onClick={() => handleFilterClick("In Progress")}>In progress</Button>

        <Button className={activeFilters.includes("Completed") ? "includes" : "notIncludes"}
          onClick={() => handleFilterClick("Completed")}>completed</Button>

        {/* <Button className={activeFilters.includes("Overdue") ? "includes" : "notIncludes"}
          onClick={() => handleFilterClick("Overdue")}>overdue</Button> */}

        <Button className={activeFilters.includes("Below 50%") ? "includes" : "notIncludes"}
          onClick={() => handleFilterClick("Below 50%")}>below 50%</Button>
        <Button className={activeFilters.includes("Below 100%") ? "includes" : "notIncludes"}
          onClick={() => handleFilterClick("Below 100%")}>below 100%</Button>
      </div>
    </>

  )
}

export default TaskFilters