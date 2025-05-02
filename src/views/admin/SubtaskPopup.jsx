import React, { useState,useRef} from "react";
import { Select , Button , Divider  , Input} from "@chakra-ui/react";


const SubtaskPopup = ({ isOpen, onClose , data }) => {
  const [selectedOption, setSelectedOption] = useState("Option1");
  

  const handleChangeAccordian = (e) => {
    setSelectedOption(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={popupStyle}>
        <div style={{display: "flex", flexDirection: "column", gap:'5px'}}>
            <div style={{ fontSize: "18px", fontWeight: 500 }}>
                Create Subtask
            </div>

            <div style={{display: "flex", flexDirection: "column", gap:'10px'}}>

            <div>
            <label>Project</label>
                <Select
                    value={selectedOption}
                    onChange={handleChangeAccordian}>
                    <option value="Option1">ABHI - Change Request Management IT</option>
                    <option value="Option2">ABHI - Change Request Management Business</option>
                </Select>
            </div>

            <div>
            <label>Issue Type</label>
                <Select
                    value={selectedOption}
                    onChange={handleChangeAccordian}
                   
                >
                    <option value="Option1">Functional Testcases</option>
                    <option value="Option2">Change Request</option>
                    <option value="Option3">Bug</option>
                    <option value="Option4">Child CR</option>
                    <option value="Option5">BAU Project</option>
                    <option value="Option6">UAT Downtime</option>

                </Select>
            </div>
            <Divider my={4} borderColor="gray.300"/>
            <div>
            <label>Status</label>
                <Select
                    value={selectedOption}
                    onChange={handleChangeAccordian}
                    width={'200px'}
                    >
                    <option value="Option1">Open</option>
                    <option value="Option2">Work In Progress</option>
                    <option value="Option3">CR Review</option>
                    <option value="Option4">Approve</option>
                    <option value="Option5">Reject</option>
                </Select>
            </div>

            <div>
            <label>Summary</label>
            <Input></Input>
            </div>

            <div>
            <label>Assignee</label>
                <Select value={selectedOption} onChange={handleChangeAccordian} width="200px">
                    <option value="Option1">Saurav Kumar</option>
                    <option value="Option2">Om Thange</option>
                    <option value="Option3">Prathamesh Kokane</option>
                </Select>
            </div>
            </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
        <Button
            onClick={onClose}
            size="sm"
            variant="outline"
            colorScheme={"blue"}
            borderRadius="4px"
            ml={2}
          >Create</Button>
          
          <Button
            onClick={onClose}
            size="sm"
            variant="outline"
            colorScheme={"white"}
            borderRadius="4px"
            ml={2}
          >Cancle</Button>
        </div>
      </div>
    </div>
  );
};

// Styles
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 100
};

const popupStyle = {
  backgroundColor: "#fff",
  display: "flex",
  flexDirection: "column",
  padding: "14px",
  gap: "15px",
  borderRadius: "8px",
  boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
  minWidth: "800px",
};


export default SubtaskPopup;
