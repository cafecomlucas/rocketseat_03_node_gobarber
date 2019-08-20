const express = require("express");

class App {
  constructor() {
    this.server = express();
    this.server.listen(3333, () =>
      console.log("Server listening on port 3333...")
    );
  }
}

module.exports = new App();
