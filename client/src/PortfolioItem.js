import React from "react";

import defaultPortfolioPic from "./portfolio_placeholder.png";

function PortfolioItem({ userPortfolio }) {
  return (
    <div className="col-6 col-md-4 portfolio-item-container slideDown">
      <div
        className="portfolio-item"
        data-toggle="modal"
        data-target={"#userPortfolio" + userPortfolio.id}
      >
        <div className="square">
          <img
            className="thumbnail"
            src={
              userPortfolio.portfolio_pic
                ? process.env.REACT_APP_API_URL +
                  "storage/" +
                  userPortfolio.portfolio_pic
                : defaultPortfolioPic
            }
            alt="portfolio pic"
          />
        </div>
        <div className="container">
          <div className="portfolio-item-title py-3">{userPortfolio.name}</div>
        </div>
      </div>

      <div
        className="modal fade"
        id={"userPortfolio" + userPortfolio.id}
        role="dialog"
      >
        <div className="modal-dialog portfolio-modal">
          <div className="modal-content modal-content-modified">
            <div className="modal-close" data-dismiss="modal">
              <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-content ">
              <div className="modal-body">
                <h3>
                  <b>{userPortfolio.name}</b>
                </h3>
                <p>
                  <a href={userPortfolio.url}>{userPortfolio.url}</a>
                </p>
                <p>{userPortfolio.description}</p>
                <hr />
                <img
                  className="img-fluid w-100 h-100"
                  src={
                    userPortfolio.portfolio_pic
                      ? process.env.REACT_APP_API_URL +
                        "storage/" +
                        userPortfolio.portfolio_pic
                      : defaultPortfolioPic
                  }
                  alt="portfolio pic"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortfolioItem;
