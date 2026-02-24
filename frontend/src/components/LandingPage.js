import { Search } from "@mui/icons-material";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import {
  InputAdornment,
  TextField,
  ToggleButton,
  Select,
  MenuItem,
} from "@mui/material";
import { Box } from "@mui/system";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { config } from "../App";
import Header from "./Header";
import "./LandingPage.css";
import VideoGrid from "./VideoGrid";
import { genres, ageGroups, sortingOptions } from "./Data";

//Constants

const LandingPage = () => {
  //States
  const { enqueueSnackbar } = useSnackbar();
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [contentRating, setContentRating] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("releaseDate");
 console.log(config.endpoint)
  /// Debouncing used to reduce the API calls  to the backend
  const debounceSearch = (searchTextValue) => {
    clearTimeout(debounceTimeout);
    setTitle(searchTextValue);
    const newTimeout = setTimeout(() => {
      let queryString = getQueryString(
        searchTextValue,
        contentRating,
        selectedGenres.toString()
      );
      fetchVideos(queryString);
    }, 500);
    setDebounceTimeout(newTimeout);
  };

  //Fetching all the videos on page load
  const fetchVideos = async (queryString = "") => {
    setLoading(true);

    try {
      const response = await axios.get(`${config.endpoint}?${queryString}`);
      if (response.status === 200) {
        setVideos(response.data.videos);
        setLoading(false);
      }
    } catch (error) {
      if (error.response.status === 404) {
        setLoading(false);
      } else {
        setLoading(false);
        enqueueSnackbar(
          "Something went wrong. Check the backend console for more details",
          { variant: "error" }
        );
      }
    }
  };

  //Creating styled custom button for genre panel
  const GenreButton = styled(ToggleButton)({
    textTransform: "capitalize",
    color: "white",
    fontFamily: "Roboto",
    border: "none",
    fontSize: "14px",
    height: "2.5em",

    "&.Mui-selected": {
      backgroundColor: "white",
      borderRadius: "20px",
      padding: "8px 16px",
      color: "#586069",
      fontSize: "14px",
      fontFamily: "Roboto",
    },

    "&.Mui-selected:hover": {
      color: "#586069",
      backgroundColor: "#ededed",
    },
  });

  /// Generating query for creating URL to handle different filters
  const getQueryString = (title, contentRating, genreArray, sortby) => {
    let queryString = "";
    if (contentRating) {
      if (contentRating === "Anyone") {
        queryString += `contentRating=${contentRating}`;
      } else {
        queryString += `contentRating=${encodeURIComponent(contentRating)}`;
      }
    }
    if (title) {
      queryString += queryString ? "&" : "";
      queryString += `title=${title}`;
    }
    if (genreArray.length > 0) {
      queryString += queryString ? "&" : "";
      queryString += `genres=${genreArray.toString()}`;
    }
    if (sortby) {
      queryString += queryString ? "&" : "";
      queryString += `sortBy=${sortby}`;
    }
    return queryString;
  };

  const handleContentRating = (value) => {
    if (value === contentRating) {
      value = "";
    }
    let queryString = getQueryString(title, value, selectedGenres, sortBy);
    fetchVideos(queryString);
    setContentRating(value);
  };

  /// Functions to set states of different filters on change
  const handleGenreSelection = (value) => {
    let newArray = [];
    if (value === "All") {
      newArray = ["All"];
    } else {
      if (selectedGenres.includes(value)) {
        newArray = selectedGenres.filter((genre) => genre !== value);
      } else {
        newArray = [...selectedGenres, value];
      }
    }

    let queryString = getQueryString(title, contentRating, newArray, sortBy);
    fetchVideos(queryString);
    setSelectedGenres(newArray);
  };

  const handleSortBy = (value) => {
    let queryString = getQueryString(
      title,
      contentRating,
      selectedGenres,
      value
    );
    fetchVideos(queryString);
    setSortBy(value);
  };

  //Fetching All videos on page load
  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <Box className="box">
      <Header hasUploadButton>
        <TextField
          id="searchbar"
          style={{
            border: "1px solid #444D56",
            width: "30%",
            borderRadius: "5px",
          }}
          size="small"
          value={title}
          onChange={(event) => debounceSearch(event.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search sx={{ color: "#EE1520" }} />
              </InputAdornment>
            ),
          }}
          placeholder="Search"
        />
      </Header>
      <Box className="genre-panel">
        <Box className="inner-panel">
          <div className="genre">
            {genres.map((genre) => {
              if (genre.value === "All") {
                return (
                  <button
                    selected={
                      selectedGenres.includes(genre.value) ? true : false
                    }
                    value={genre.value}
                    className="genre-button"
                    onClick={(event) =>
                      handleGenreSelection(event.target.value)
                    }
                    key={genres.indexOf(genre)}
                  >
                    {genre.label}
                  </button>
                );
              }

              return (
                <GenreButton
                  variant="contained"
                  selected={selectedGenres.includes(genre.value) ? true : false}
                  value={genre.value}
                  className="genre-button"
                  onClick={(event) => handleGenreSelection(event.target.value)}
                  key={genres.indexOf(genre)}
                >
                  {genre.label}
                </GenreButton>
              );
            })}
          </div>
          <div className="genre">
            {ageGroups.map((age) => {
              if (age.value === "All") {
                return (
                  <button
                    selected={contentRating === age.value}
                    variant="contained"
                    className="genre-button"
                    value={age.value}
                    onClick={(e) => {
                      handleContentRating(e.target.value);
                    }}
                    key={ageGroups.indexOf(age)}
                  >
                    {age.label}
                  </button>
                );
              }
              return (
                <GenreButton
                  selected={contentRating === age.value}
                  variant="contained"
                  value={age.value}
                  onClick={(e) => {
                    handleContentRating(e.target.value);
                  }}
                  key={ageGroups.indexOf(age)}
                >
                  {age.label}
                </GenreButton>
              );
            })}
          </div>
        </Box>
        <Select
          className="sort-dropdown"
          sx={{
            fontFamily: "Roboto",
            borderRadius: "20px",
            border: "none",
            color: "#586069",
          }}
          onChange={(event) => {
            handleSortBy(event.target.value);
          }}
          defaultValue={"releaseDate"}
          IconComponent={ImportExportIcon}
        >
          {sortingOptions.map((opt) => (
            <MenuItem
              sx={{ fontFamily: "Roboto" }}
              key={opt.value}
              value={opt.value}
              className="menu-item"
            >
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box className="grid-container">
        <div className="display-grid">
          <VideoGrid videos={videos} loading={isLoading} />
        </div>
      </Box>
    </Box>
  );
};
export default LandingPage;
