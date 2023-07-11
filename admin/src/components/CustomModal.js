import React from "react";
import { Button, Card, Modal, Slide } from "@mui/material";

import { makeStyles } from "@mui/styles";
import { CloseRounded } from "@mui/icons-material";


const useStyles = makeStyles({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  card: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    padding: "30px 40px !important",
    borderRadius: 20,
    boxShadow: "0 10px 25px 0 rgba(0, 0, 0, 0.05)",
    animation: "zoomIn 1s"

  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#052971",
    marginBottom: "30px",
    fontSize: 22,
    fontWeight: "bold",
    zIndex: 100000,
    "& svg": {
      position: "absolute",
      cursor: "pointer",
      top: 30,
      right: 40,
      color: "#f44336",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        transform: "scale(1.5)"
      }
    }
  }
});

function CustomModal(props) {
  const cls = useStyles();
  const {
    open = false,
    index,
    onClose,
    name,
    className,
    children
  } = props;
  console.log("open", open);
  if (!open)
    return <></>;
  
  return (
    <Modal
      open={open}
      className={cls.modal + " the-modal "+className}
      onClose={onClose}>
      <Slide direction="up" in={true} mountOnEnter unmountOnExit>
        <Card className={"the-modal-inner"}>
          <div className={"the-modal-header"}>
            <span>{name + " #" + index}</span>
            <Button onClick={onClose}><CloseRounded/></Button>
          </div>
            {children}
        </Card>
      </Slide>
    </Modal>
  );
}

export default CustomModal;
