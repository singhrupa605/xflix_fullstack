import { Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import "./Header.css";
import UploadIcon from "@mui/icons-material/Upload";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import ModalPage from "./ModalPage";
import { useState } from "react";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Header = ({ children, hasUploadButton }) => {
  const [isOpen, setIsOpen] = useState(false);

  const StyledButton = styled(Button)({
    backgroundColor: "#4CA3FC",
    color: "white",
    display: "flex",
    textTransform: "none",
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: "1rem",
    paddingLeft: "2em",
    paddingRight: "2em",
    justifyContent: "space-between",

    "&:hover": {
      backgroundColor: "#a9a9a9",
    },
    "&:focus": {
      backgroundColor: "grey",
    },
    "&:active": {
      backgroundColor: "red",
    },
  });

  return hasUploadButton ? (
    <Box>
      <AppBar position="static">
        <Toolbar className="header">
          <Box className="header-title">
            <p className="x">X</p>
            <p className="flix">Flix</p>
          </Box>
          {children}
          <StyledButton onClick={() => setIsOpen(true)}>
            <UploadIcon />
            Upload
          </StyledButton>
        </Toolbar>
      </AppBar>
      <ModalPage
        open={isOpen}
        handleClose={() => {
          setIsOpen(false);
        }}
      />
    </Box>
  ) : (
    <AppBar position="static">
      <Toolbar className="header">
        <Box className="header-title">
          <p className="x">X</p>
          <p className="flix">Flix</p>
        </Box>

        <Link className="goBack" to="/">
          {" "}
          <StyledButton>
            <ArrowBackIcon /> Go to Home
          </StyledButton>
        </Link>
      </Toolbar>
    </AppBar>
  );
};
export default Header;
