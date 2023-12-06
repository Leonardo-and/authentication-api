const express = require("express");
const morgan = require("morgan");
const userRoutes = require("./routes/userRoutes");
const { PORT } = process.env;
require("dotenv").config();

class App {
  constructor() {
    this.app = express();
    this.port = PORT;
  }

  start() {
    this.setupExpress();
    this.setRoutes();
    this.app.listen(PORT || 3030, () => {
      console.log(`
              Server Running!
                  http://localhost:${PORT}
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
