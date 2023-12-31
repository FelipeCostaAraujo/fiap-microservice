require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const router = require("./routes/routes");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan("combined"));
app.use(cors());
app.use("/api", router);

app.listen(4000, () => {
  console.log(`Servidor online em http://127.0.0.1:4000`);
});
