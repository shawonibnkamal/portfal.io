import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Navbar({ loggedIn, setLoggedIn, userInfo }) {
  const handleLogout = (e) => {
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
    <div className="navbar text-dark">
      <Link to="/" className="text-dark navbar-brand text-monospace">
        Portfal.io
      </Link>
      {loggedIn ? (
        <>
          <div className="mr-auto">
            <a href="/">
              <button className="btn btn-dark mr-2">Portfolios</button>
            </a>
            <a href="/settings">
              <button className="btn btn-outline-dark mr-2">
                Account Settings
              </button>
            </a>
          </div>
          <div className="mr-right">
            <div className="dropdown">
              <button
                className="btn btn-light dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Account
              </button>
              <div
                className="dropdown-menu dropdown-menu-right"
                aria-labelledby="dropdownMenuButton"
              >
                <a className="dropdown-item" href={"/" + userInfo.username}>
                  Profile
                </a>
                <a className="dropdown-item" href="#" onClick={handleLogout}>
                  Logout
                </a>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>
          <Link className="text-dark btn" to="/login">
            {" "}
            Login{" "}
          </Link>
          <Link className="btn btn-outline-info" to="/signup">
            {" "}
            Sign Up{" "}
          </Link>
        </div>
      )}
    </div>
  );
}

export default Navbar;