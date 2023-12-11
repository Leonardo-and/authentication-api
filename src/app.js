const express = require("express");
const morgan = require("morgan");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

class App {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3001;
  }

  start() {
    this.setupExpress();
    this.setRoutes();
    this.app.listen(this.port, () => {
      console.log(`
              Server Running!
                  http://localhost:${this.port}
          `);
    });
  }

  setRoutes() {
    this.app.use(userRoutes);
  }

  setupExpress() {
    this.app.use(morgan("dev"));
    this.app.use(express.json());
  }
}

const app = new App();
app.start();
