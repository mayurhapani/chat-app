const express = require("express");
const http = require("http");
const app = express();
const port = 8000;
const path = require("path");

const Server = http.createServer(app);

app.use(express.static(path.join(__dirname, "public")));

Server.listen(port, () => {
  console.log(`Server is running on http://localhost/${port}`);
});
