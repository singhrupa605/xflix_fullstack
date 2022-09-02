import { SentimentDissatisfied } from "@mui/icons-material";
import { Card, CardMedia, CircularProgress } from "@mui/material";
import "./VideoGrid.css";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import { Grid } from "@mui/material";

const VideoGrid = ({ videos, loading }) => {
  const VideoCard = ({ video }) => {
    return (
      <Card
        className="card"
        id={video._id}
        sx={{ backgroundColor: "#181818", color: "white" }}
      >
        <CardMedia
          alt={video.title}
          component="img"
          image={video.previewImage}
        />
        <h4 id="title">{video.title}</h4>
        <p id="date">{video.releaseDate}</p>
      </Card>
    );
  };

  return (
    <Box>
      {loading ? (
        <CircularProgress sx={{ marginTop: "10rem" }} />
      ) : videos.length ? (
        <Grid container columnSpacing={2}>
          {videos.map((video) => (
            <Grid item xs={12} sm={6} md={3} key={video._id}>
              <Link to={`/:${video._id}`} style={{ textDecoration: "none" }}>
                {" "}
                <VideoCard video={video} />
              </Link>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box className="sentiment-icon">
          <SentimentDissatisfied sx={{ color: "white" }} />
        </Box>
      )}
    </Box>
  );
};

export default VideoGrid;
