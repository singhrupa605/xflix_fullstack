import './App.css';
import { Route, Switch} from "react-router-dom";
import LandingPage from "./components/LandingPage";
import VideoPage from "./components/VideoPage";

export const config = {
  // endpoint: `https://10fc848d-d9b9-48f3-a810-41acb426422e.mock.pstmn.io/v1/videos`,
  endpoint :`https://xflix-rupa.herokuapp.com/v1/videos`
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