import {
  SentimentDissatisfied,
  ThumbUpAlt,
  ThumbDownAlt,
} from "@mui/icons-material";
import {
  CircularProgress,
  Button,
  Stack,
  Divider,
  Typography,
} from "@mui/material";
import moment from "moment";
import CircleIcon from "@mui/icons-material/Circle";
import { Box } from "@mui/system";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useSnackbar } from "notistack";
import  { useEffect, useState } from "react";
import { useParams } from "react-router";
import { config } from "../App";
import Header from "./Header";
import VideoGrid from "./VideoGrid";
import "./VideoPage.css";

const VideoPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [thisVideo, setThisVideo] = useState(null);
  const params = useParams();
  const [votes, setVotes] = useState({ upVote: false, downVote: false });

  const getAllVideos = async () => {
    setLoading(true);
    const URL = `${config.endpoint}`;
    try {
      await axios
        .get(URL)
        .then((response) => {
          if (response.status === 200) {
            setLoading(false);
            setVideos(response.data.videos);
          }
        })
        .catch((error) => {
          setLoading(false);
          enqueueSnackbar(error.reponse.statusText);
        });
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(
        "Something went wrong. Check the backend console for more details",
        { variant: "error" }
      );
    }
  };

  const getVideoData = async () => {
    const videoId = params.id.replace(":", "");
    setLoading(true);
    try {
      const res = await axios.get(`${config.endpoint}/${videoId}`);
      setThisVideo(res.data);
      setLoading(false);
      return res.data;
    } catch (e) {
      console.log(e);
      if (e.response.status === 404) {
        setLoading(false);
        setThisVideo(null);
        enqueueSnackbar("Video not found with the given id", {
          variant: "error",
        });

        return null;
      } else {
        setLoading(false);
        setThisVideo(null);
        enqueueSnackbar("Something went wrong!", { variant: "error" });
        return null;
      }
    }
  };

  const VotingButton = styled(Button)({
    backgroundColor: "rgb(56, 55, 55)",
    borderRadius: "20px",
    fontSize: "0.8rem",
    color: "white",
    display: "flex",
    height: "3rem",
    justifyContent: "space-around",

    "& .icon": {
      color: "#797979",
    },

    "&:focus": {
      backgroundColor: "#4CA3FC",
    },

    "&:focus .icon": {
      color: "white",
    },
  });

  const performPatchCall = async (URL, data = null) => {
    try {
      if (data) {
        await axios.patch(URL, data);
      } else {
        await axios.patch(URL);
      }
      return true;
    } catch (e) {
      if (e.response.data.message) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Something went wrong", { variant: "error" });
      }
    }
  };

  const increaseViewCount = async (id) => {
    const url = `${config.endpoint}/${id}/views`;
    await performPatchCall(url);
  };

  const updateVoteCount = async (name, id) => {
    const URL = `${config.endpoint}/${id}/votes`;
    // console.log(thisVideo);
    const data = {
      vote: name,
      change: "increase",
    };
    try {
      if (name === "upVote") {
        thisVideo.votes.upVotes += 1;
      }
      if (name === "downVote") {
        thisVideo.votes.downVotes += 1;
      }
      let response = await performPatchCall(URL, data);
      if (response) {
        setVotes({ ...votes, [name]: true });
      }
    } catch (error) {
      enqueueSnackbar("Something went wrong cannot update votes", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    getAllVideos();
  }, []);

  useEffect(() => {
    const performInitials = async () => {
      const videoId = params.id.replace(":", "");
      await getVideoData();
      await increaseViewCount(videoId);
    };

    performInitials();
  }, [params.id]);

  return (
    <Stack className="video-page-box" spacing={1} direction="column">
      <Header />
      <Stack direction="column" spacing={2} sx={{ width: "80%" }}>
        {isLoading ? (
          <Box className="progress-box">
            <CircularProgress />
          </Box>
        ) : thisVideo ? (
          <Box className="frame-box">
            <iframe
              className="frame"
              src={`https://www.${thisVideo.videoLink}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <Box className="heading-box">
              <Stack className="videoinfo" spacing={2}>
                <Typography className="title">{thisVideo.title}</Typography>
                <Typography className="subheading" variant="p">
                  +{thisVideo.viewCount} views
                  <span>
                    <CircleIcon className="circleicon" />
                  </span>
                  {moment(thisVideo.releaseDate).fromNow()}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1}>
                <VotingButton
                  onClick={() => updateVoteCount("upVote", thisVideo._id)}
                >
                  <ThumbUpAlt className="icon" />
                  <span>{` ${thisVideo.votes.upVotes} k`}</span>
                </VotingButton>
                <VotingButton
                  onClick={() => {
                    updateVoteCount("downVote", thisVideo._id);
                  }}
                >
                  <ThumbDownAlt className="icon" />
                  <span>{` ${thisVideo.votes.downVotes} k`}</span>
                </VotingButton>
              </Stack>
            </Box>
          </Box>
        ) : (
          <Typography
            variant="h6"
            sx={{
              color: "#C2C2C2",
              fontFamily: "Roboto",
              fontWeight: "600",
              marginTop: "1em",
            }}
          >
            Please select another video !
          </Typography>
        )}
        {videos.length ? (
          <div>
            <Divider light sx={{ backgroundColor: "#555353" }} />
            <VideoGrid videos={videos} />
          </div>
        ) : (
          <SentimentDissatisfied
            sx={{
              color: "white",
              position: "absolute",
              top: "50%",
              left: "50%",
            }}
          />
        )}
      </Stack>
    </Stack>
  );
};

export default VideoPage;
