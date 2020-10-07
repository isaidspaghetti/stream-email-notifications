import React, { useState, useEffect } from "react";
import { StreamApp, NotificationDropdown } from "react-activity-feed";
import "react-activity-feed/dist/index.es.css";
import axios from "axios";
import Notification from "./Notification";
import "./App.css";
import "./Notification.css";

function App() {
  const [streamCredentials, setStreamCredentials] = useState(null);

  useEffect(() => {
    async function register() {
      try {
        var response = await axios.get("http://localhost:8080/registration");

        setStreamCredentials({
          token: response.data.userToken,
          apiKey: response.data.streamApiKey,
          appId: response.data.appId,
        });
      } catch (e) {
        console.error(e, e.error);
      }
    }
    register();
  }, []);

  if (streamCredentials) {
    return (
      <div>
        <h2 className="app-title">Stream Custom Email Notifications</h2>
        <div className="container">
          <StreamApp
            className="stream-app"
            apiKey={streamCredentials.apiKey}
            token={streamCredentials.token}
            appId={streamCredentials.appId}
          >
            <NotificationDropdown
              FeedGroup="notification"
              Group={Notification}
            />
          </StreamApp>
        </div>
      </div>
    );
  } else {
    return <h1>Retrieving token...</h1>;
  }
}

export default App;
