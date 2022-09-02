import { TextField, Button, MenuItem, Typography, Stack } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import { config } from "../App";
import Modal from "@mui/material/Modal";
import "./ModalPage.css";
import moment from "moment";
import { genres, ageGroups } from "./Data";
import ClearIcon from "@mui/icons-material/Clear";
import { useState } from "react";

const ModalPage = ({ handleClose, open }) => {
  const { enqueueSnackbar } = useSnackbar();
  const initialData = {
    videoLink: "",
    title: "",
    genre: "",
    contentRating: "",
    releaseDate: "",
    previewImage: "",
  };
  const [inputData, setInputData] = useState(initialData);

  // Uploading the Video to the backend
  const UploadVideo = async (data) => {
    const dataToPost = {
      ...data,
      releaseDate: moment(data.releaseDate).format("DD MMM YYYY"),
    };
    if (validateInput(dataToPost)) {
      try {
        console.log(dataToPost);
        const res = await axios.post(`${config.endpoint}`, dataToPost);
        if (res.status === 201) {
          enqueueSnackbar("Video Uploaded Successfully", {
            variant: "success",
          });
          setInputData(initialData);
          handleClose();
        }
      } catch (e) {
        if (e.response.data) {
          enqueueSnackbar(e.response.data.message, { variant: "error" });
        } else {
          enqueueSnackbar("Something went wrong", { variant: "error" });
        }
      }
    }
  };

  /// Validating the input fields
  const validateInput = (data) => {
    if (!data.videoLink) {
      enqueueSnackbar("Video link is a required field!", {
        variant: "warning",
      });
      return false;
    }
    if (!data.title) {
      enqueueSnackbar("Title is a required field!", {
        variant: "warning",
      });
      return false;
    }
    if (!data.genre) {
      enqueueSnackbar("Genre is a required field!", {
        variant: "warning",
      });
      return false;
    }
    if (!data.contentRating) {
      enqueueSnackbar("Age group is a required field!", {
        variant: "warning",
      });
      return false;
    }
    if (!data.releaseDate) {
      enqueueSnackbar("Upload and Publish date is a required field!", {
        variant: "warning",
      });
      return false;
    }
    return true;
  };

  /// Handling the text change in the text fields
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputData((inputs) => ({ ...inputs, [name]: value }));
  };

  /// Creating common custom style for all textfields

  const style = {
    "& label": {
      color: "#bfbfbf",
      fontFamily: "Roboto",
    },
    "& label.Mui-focused": {
      color: "#bfbfbf",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#ebebeb",
    },
    "& .MuiFormHelperText-root": {
      color: "#bfbfbf",
    },
    "& .MuiOutlinedInput-root": {
      color: "#ffffff",
      "& fieldset": {
        borderColor: "#bfbfbf",
      },
      "&:hover fieldset": {
        borderColor: "#ffffff",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#ebebeb",
      },
    },
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="modal"
    >
      <Stack
        className="video-form"
        id="uploading-form"
        direction="column"
        spacing={1}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            sx={{ alignSelf: "flex-start", fontFamily: "Roboto" }}
          >
            Upload Video
          </Typography>
          <ClearIcon
            sx={{ "&:hover": { cursor: "pointer", color: "#bfbfbf" } }}
            onClick={handleClose}
          />
        </Box>
        <TextField
          sx={style}
          required
          name="videoLink"
          label="Video Link"
          helperText="This link will be used to derive the video"
          value={inputData.videoLink}
          onChange={(event) =>
            setInputData({ ...inputData, videoLink: event.target.value })
          }
          fullWidth
        />
        <TextField
          required
          sx={style}
          name="previewImage"
          label="Thumbnail Image Link"
          value={inputData.previewImage}
          onChange={(event) => handleChange(event)}
          helperText="This link will be used to preview the thumbnail image"
          fullWidth
        />
        <TextField
          required
          sx={style}
          name="title"
          label="Title"
          value={inputData.title}
          onChange={(event) => handleChange(event)}
          helperText="This title will be the representative text for video"
          fullWidth
        />
        <TextField
          select
          required
          sx={style}
          name="genre"
          label="Genre"
          value={inputData.genre}
          onChange={handleChange}
          helperText="Genre will help in categorizing your videos"
        >
          {genres.map((genre) => {
            if (genre.value !== "All") {
              return (
                <MenuItem id="menu-item" key={genre.value} value={genre.value}>
                  {genre.label}
                </MenuItem>
              );
            }
            return null;
          })}
        </TextField>
        <TextField
          select
          required
          sx={style}
          name="contentRating"
          value={inputData.contentRating}
          onChange={(event) => handleChange(event)}
          label="Suitable age group for the clip"
          helperText="This will be used to filter videos on age group suitability"
        >
          {ageGroups.map((age) => {
            if (age.value !== "All") {
              return (
                <MenuItem id="menu-item" key={age.value} value={age.value}>
                  {age.label}
                </MenuItem>
              );
            }
            return null;
          })}
        </TextField>
        <TextField
          type="date"
          sx={{ ...style, "&:hover": { cursor: "pointer" } }}
          name="releaseDate"
          label="Release date"
          helperText="This will be used to sort videos"
          InputLabelProps={{
            shrink: true,
          }}
          value={inputData.releaseDate}
          onChange={(event) => handleChange(event)}
        ></TextField>

        <Stack direction="row" spacing={1}>
          <Button
            sx={{
              backgroundColor: "#EE1520",
              fontWeight: "500",
              color: "white",
              fontFamily: "Roboto",
            }}
            onClick={() => UploadVideo(inputData)}
          >
            UPLOAD VIDEO
          </Button>
          <Button
            sx={{
              color: "white",
              fontFamily: "Roboto",
              "&:hover": { backgroundColor: "#707070" },
            }}
            onClick={() => {
              setInputData(initialData);
              handleClose();
            }}
          >
            CANCEL
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default ModalPage;
