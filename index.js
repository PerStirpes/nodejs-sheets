const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

const uuidV1 = require("uuid/v1");

const goog = require("googleapis");
const credentials = require("./credentials.json");

const auth = new goog.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  ["https://www.googleapis.com/auth/spreadsheets"],
  null
);

goog.options({auth});

const sheets = goog.sheets("v4");
const spreadsheetId = "null";

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/animals", (req, res) => {
  sheets.spreadsheets.values.append(
    {
      spreadsheetId,
      range: "dogs!all",
      valueInputOption: "USER_ENTERED",
      includeValuesInResponse: true,
      resource: {
        values: [[req.body.name, req.body.count]]
      }
    },
    (err, response) => {
      res.send(response.updates);
    }
  );
});

app.get("/dogs", (req, res) => {
  sheets.spreadsheets.values.get(
    {
      spreadsheetId,
      range: "dogs!all"
    },
    (err, response) => {
      res.send(response.values.map(([name, count]) => ({name, count})));
    }
  );
});

app.listen(4200);
