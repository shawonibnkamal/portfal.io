import React, { useState, useEffect } from "react";
import axios from "axios";
import defaultProfilePic from "./profile_placeholder.png";

function Settings() {
  const [userInfo, setUserInfo] = useState({});
  //state to store user portfolio from server
  //state to trigger useEffect
  const [userTrigger, setUserTrigger] = useState(false);
  //states to store form data when changed
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicImage, setProfilePicImage] = useState("");
  const [response, setResponse] = useState("");
  const [errors, setErrors] = useState("");

  //get logged in user info from server
  useEffect(() => {
    axios
      .post(
        process.env.REACT_APP_API_URL + "api/login/user",
        {},
        {
          headers: {
            authorization: "Bearer " + localStorage.getItem("login_token"),
          },
        }
      )
      .then((res) => {
        //console.log(res.data.user_info);
        setUserInfo(res.data.user_info);
        setUsername(res.data.user_info.username);
        setFirstName(res.data.user_info.first_name);
        setLastName(res.data.user_info.last_name);
        setUrl(res.data.user_info.url);
        setDescription(res.data.user_info.description);
      })
      .catch((error) => console.log(error.response.data));
  }, [userTrigger]);

  const [imageError, setImageError] = useState();
  const handleFileUpload = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].size <= 2000000) {
        setImageError("");
        setProfilePicImage(e.target.files[0]);
      } else {
        setImageError("File size must be less than 2mb.");
      }
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    //form data to send to server with axios in handleSave
    var data = new FormData();
    data.append("_method", "PUT");

    if (username) {
      data.append("username", username);
    }

    if (firstName) {
      data.append("first_name", firstName);
    }

    if (lastName) {
      data.append("last_name", lastName);
    }

    if (password) {
      data.append("password", password);
    }

    if (profilePicImage) {
      data.append("profile_pic_image", profilePicImage);
    }

    data.append("description", description);
    data.append("url", url);

    //send data to server
    axios
      .post(process.env.REACT_APP_API_URL + "api/user/" + userInfo.id, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: "Bearer " + localStorage.getItem("login_token"),
        },
      })
      .then((res) => {
        //console.log(res.data);
        //window.location.reload();
        setUserTrigger(!userTrigger);
        setResponse("Settings updated!");
        setErrors("");
      })
      .catch((error) => {
        setErrors("");
        console.log(error.response.data);
        if (error.response.data.message !== undefined) {
          setResponse(error.response.data.message);
        }
        if (error.response.data.errors !== undefined) {
          setErrors(error.response.data.errors);
        }
      });
  };

  const handleDeleteAccount = (e) => {
    e.preventDefault();
    var check = window.confirm(
      "Are you sure, you want to delete your account? This is not reversible."
    );
    if (check) {
      //delete user
      console.log("Deleting user");
      axios
        .delete(process.env.REACT_APP_API_URL + "api/user/" + userInfo.id, {
          headers: {
            authorization: "Bearer " + localStorage.getItem("login_token"),
          },
        })
        .then((res) => {
          //console.log(res.data);
          localStorage.removeItem("login_token");

          window.location.reload();
        })
        .catch((error) => console.log(error.response.data));
    }
  };

  return (
    <>
      <div className="settings-container slideDown">
        <div className="border border-black m-3 p-3">
          <form onSubmit={handleSave} method="post">
            <div className="text-center">
              <img
                className="profile-pic"
                src={
                  userInfo.profile_pic
                    ? process.env.REACT_APP_API_URL +
                      "storage/" +
                      userInfo.profile_pic
                    : defaultProfilePic
                }
                alt="profile pic"
              />{" "}
            </div>
            <br />
            <div className="form-group">
              <input
                type="file"
                name="profile_pic"
                accept=".png, .jpg"
                onChange={(e) => handleFileUpload(e)}
              />{" "}
              <br />
              <div className="text-danger">{imageError}</div>
            </div>
            <div className="form-group">
              <label> Username</label>
              <input
                className="form-control"
                type="text"
                name="username"
                value={username ? username : ""}
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className="text-danger">{errors.username}</div>
            </div>
            <div className="form-group">
              <label> First Name</label>
              <input
                className="form-control"
                type="text"
                name="first_name"
                value={firstName ? firstName : ""}
                onChange={(e) => setFirstName(e.target.value)}
              />{" "}
            </div>
            <div className="form-group">
              <label> Last Name </label>
              <input
                className="form-control"
                type="text"
                name="last_name"
                value={lastName ? lastName : ""}
                onChange={(e) => setLastName(e.target.value)}
              />{" "}
            </div>
            <div className="form-group">
              <label> Website </label>
              <input
                className="form-control"
                type="text"
                name="url"
                value={url ? url : ""}
                onChange={(e) => setUrl(e.target.value)}
              />{" "}
              <div className="text-danger">{errors.url}</div>
            </div>
            <div className="form-group">
              <label> Description </label>
              <textarea
                className="form-control"
                type="text"
                name="description"
                maxLength="500"
                value={description ? description : ""}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="form-group">
              <label> Change Password </label>
              <input
                className="form-control"
                type="password"
                name="password"
                placeholder="*****"
                onChange={(e) => setPassword(e.target.value)}
              />{" "}
            </div>
            <div className="form-group">
              <input
                className="btn btn-primary w-100"
                type="submit"
                name="submit"
                value="Save"
              />
              {response}
            </div>
          </form>
          <a href="/" className="text-danger" onClick={handleDeleteAccount}>
            Delete Account
          </a>
        </div>
      </div>
    </>
  );
}

export default Settings;
