import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useHistory } from "react-router-dom";
import PortfolioGallery from "./PortfolioItem";
import defaultProfilePic from "./profile_placeholder.png";

function UserPortfolio({ usernameProp }) {
  const history = useHistory();
  //used to get username from url
  var currentLocation = useLocation();
  var username = usernameProp
    ? usernameProp
    : currentLocation.pathname.substring(1);

  //state to store user info from server
  const [userInfo, setUserInfo] = useState({});
  //state to store user portfolio from server
  const [userPortfolios, setUserPortfolios] = useState([]);

  useEffect(() => {
    if (username !== "") {
      axios
        .get(
          process.env.REACT_APP_API_URL + "api/user/" + username + "/portfolio"
        )
        .then((res) => {
          //console.log(res.data);
          setUserInfo(res.data.userPortfolios[0][0]);
          setUserPortfolios(res.data.userPortfolios[1]);
        })
        .catch((error) => {
          console.log(error.response.data);
          history.push("/");
        });
    }
  }, []);

  return (
    <div className="container">
      <div className="profile-header">
        <img
          className="profile-pic"
          src={userInfo.profile_pic ? process.env.REACT_APP_API_URL + "storage/" + userInfo.profile_pic : defaultProfilePic}
          alt="profile pic"
        />
        <div className="profile-username">@{userInfo.username}</div>
      </div>

      <div className="row">
        {userPortfolios.map((data) => {
          return <PortfolioGallery userPortfolio={data} key={data.id} />;
        })}
      </div>
    </div>
  );
}

export default UserPortfolio;
