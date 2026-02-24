import './App.css';
import { Route, Switch} from "react-router-dom";
import LandingPage from "./components/LandingPage";
import VideoPage from "./components/VideoPage";

export const config = {
  endpoint : process.env.REACT_APP_API_BASE_URL};

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path = "/:id"  component = {VideoPage} />
        <Route path = "/"  component = {LandingPage} />
      </Switch>
    </div>
  );
}


export default App;