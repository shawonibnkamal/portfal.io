import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Navbar({ loggedIn, setLoggedIn, userInfo }) {
  const handleLogout = (e) => {
    e.preventDefault();
    axios
      .post(
        process.env.REACT_APP_API_URL + "api/logout",
        {},
        {
          headers: {
            authorization: "Bearer " + localStorage.getItem("login_token"),
          },
        }
      )
      .then((res) => {
        //console.log("logging out token> " + localStorage.getItem("login_token"));
        //console.log(res.data);
        localStorage.removeItem("login_token");
        //console.log("after remove token> " + localStorage.getItem("login_token"));

        setLoggedIn(false);
      })
      .catch((error) => console.log(error.response.data));
  };

  return (
    <div className="navbar navbar-expand-lg navbar-light bg-light">
      <Link to="/" className="navbar-brand text-monospace ">
        Portfal.io
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {loggedIn ? (
        <>
          <div
            className="collapse navbar-collapse"
            id="navbarNavDropdown"
            style={{ justifyContent: "space-between" }}
          >
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/">
                  <button className="btn btn-custom1 mr-2">Dashboard</button>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-custom1 mr-2" to="/settings">
                  Settings
                </Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-custom1 mr-2" to="/contact">
                  Feedback
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <Link
                  className="btn dropdown-toggle"
                  to="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Account
                </Link>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a className="dropdown-item" href={"/" + userInfo.username}>
                    Profile
                  </a>
                  <a className="dropdown-item" href="/" onClick={handleLogout}>
                    Logout
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <>
          <div
            className="collapse navbar-collapse"
            id="navbarNavDropdown"
            style={{ justifyContent: "flex-end" }}
          >
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="text-dark btn" to="/contact">
                  Feedback
                </Link>
              </li>
              <li className="nav-item">
                <Link className="text-dark btn mr-2" to="/login">
                  {" "}
                  Login{" "}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="text-dark btn" to="/signup">
                  {" "}
                  Sign Up{" "}
                </Link>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default Navbar;
