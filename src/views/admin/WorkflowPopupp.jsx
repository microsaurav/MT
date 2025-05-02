import React, { useState,useRef} from "react";
import { Select , Button } from "@chakra-ui/react";
import ReactQuill from 'react-quill';


const Popup = ({ isOpen, onClose , data }) => {
  const [selectedOption, setSelectedOption] = useState("Option1");
   const quillRef = useRef(null);

  const handleChangeAccordian = (e) => {
    setSelectedOption(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={popupStyle}>
        <div style={{display: "flex", flexDirection: "column", gap:'5px'
          }}
        >
          <label>Assignee</label>
          <Select
            value={selectedOption}
            onChange={handleChangeAccordian}
            width="200px"
          >
            <option value="Option1">Mahesh Nair</option>
            <option value="Option2">Atul Sawant</option>
            <option value="Option3">Puneet Sharma</option>
          </Select>

          <ReactQuill ref={quillRef} theme="snow" />
          
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          <Button
            onClick={onClose}
            size="sm"
            variant="outline"
            colorScheme={"blue"}
            borderRadius="4px"
            ml={2}
          >{data}</Button>

          <Button
            onClick={onClose}
            size="sm"
            variant="outline"
            colorScheme={"blue"}
            borderRadius="4px"
            ml={2}
          >Close</Button>
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
};

const popupStyle = {
  backgroundColor: "#fff",
  display: "flex",
  flexDirection: "column",
  padding: "20px",
  gap: "15px",
  borderRadius: "8px",
  boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
  minWidth: "300px",
};


export default Popup;
