import './App.css';
import { Route, Switch} from "react-router-dom";
import LandingPage from "./components/LandingPage";
import VideoPage from "./components/VideoPage";

export const config = {
  endpoint :`http://localhost:8082/v1/videos`
};

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