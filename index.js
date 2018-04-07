const serverless = require("serverless-http");
const express = require("express");
const app = express();
const axios = require("axios");

const mailChimp = {
  preLaunchListId: "ff8c131f0e",
  apiUrl: "https://us12.api.mailchimp.com/3.0/"
};

app.get("/", (req, res) => {
  res.send("hdadada");
});

module.exports.handler = serverless(app);
module.exports.addToBetaUserList = function(event, context, callback) {
  console.log("event", process.env);
  const body = JSON.parse(event.body);
  const auth = {
    username: "kilgarenone",
    password: process.env.MAILCHIMP_API_KEY
  };
  const user = {
    email_address: body.emailAddress,
    status: "subscribed"
  };

  axios
    .post(
      `${mailChimp.apiUrl}lists/${mailChimp.preLaunchListId}/members/`,
      user,
      { auth, headers: { "content-type": "application/json" } }
    )
    .then(function() {
      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify({
          message: "Successfully added to beta user list!"
        })
      };
      callback(null, response);
    })
    .catch(e => {
      const error = e.response.data;
      const errorResponse = {
        statusCode: error.status,
        headers: {
          "Access-Control-Allow-Origin": "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify({
          message: error.title
        })
      };
      callback(null, errorResponse);
    });
};
