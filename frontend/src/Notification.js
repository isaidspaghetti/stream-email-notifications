import React from "react";
import youtubeIcon from "./youtube-icon.png";
import twitterIcon from "./twitter-icon.png";
import mailIcon from "./mail-icon.png";

const Notification = (activity) => {
  if (activity.activityGroup.verb === "comment") {
    if (activity.activityGroup.activity_count <= 1) {
      return (
        <div className="notification">
          <div className="notification-header">
            <img className="icon-wide" src={youtubeIcon} alt="youtube-icon" />
            <div className="youtube">
              <strong>New YouTube Comment</strong> from{" "}
              {activity.activityGroup.activities[0].from}{" "}
            </div>
          </div>
          <p className="notification-content youtube">
            {activity.activityGroup.activities[0].body}
          </p>
        </div>
      );
    } else {
      return (
        <div className="notification">
          <div className="notification-header">
            <img className="icon-wide" src={youtubeIcon} alt="youtube-icon" />
            <div className="youtube">
              <strong>
                {activity.activityGroup.activity_count} New YouTube Comments{" "}
              </strong>
            </div>
          </div>
        </div>
      );
    }
  } else if (activity.activityGroup.verb === "message") {
    if (activity.activityGroup.activity_count <= 1) {
      return (
        <div className="notification">
          <div className="notification-header">
            <img className="icon" src={twitterIcon} alt="twitter-icon" />
            <div className="twitter">
              <strong>New Twitter DM</strong>
            </div>
          </div>
          <p className="twitter">
            From {activity.activityGroup.activities[0].from}
          </p>
          <p className="notification-content twitter">
            {activity.activityGroup.activities[0].body}
          </p>
        </div>
      );
    } else {
      return (
        <div className="notification">
          <div className="notification-header">
            <img className="icon" src={twitterIcon} alt="twitter-icon" />

            <div className="twitter">
              <strong>
                {activity.activityGroup.activity_count} New Twitter DMs
              </strong>
            </div>
          </div>
          <p className="notification-content twitter">
            {activity.activityGroup.activities.map((activity) => {
              return <div>{activity.from}, </div>;
            })}
          </p>
        </div>
      );
    }
  } else {
    return activity.activityGroup.activities.map((email) => {
      return (
        <div className="notification">
          <div className="notification-header">
            <img
              className="icon-wide"
              src={mailIcon}
              alt="mail"
              width="100px"
            />
            <div className="email">
              <strong>New Email</strong> From: {email.from}
              <br />
              To: {email.recipient}
            </div>
          </div>
          <p className="notification-content email">{email.body}</p>
        </div>
      );
    });
  }
};

export default Notification;
