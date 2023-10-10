require("dotenv").config();

const express = require("express");
const db = require("./database");
const router = require("./routes/userRoutes");
const cors = require("cors");


const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/expenses", router);


const port = process.env.PORT || 3000;



const closeDatabaseConnection = () => {
  connection.end((err) => {
    if (err) {
      console.error("Error closing the database connection:", err);
    } else {
      console.log("Database connection closed.");
    }
  });
};

// Listen for SIGINT (Ctrl+C) and SIGTERM signals to close the connection
process.on("SIGINT", () => {
  console.log("Received SIGINT. Closing the server and database connection...");
  closeDatabaseConnection();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log(
    "Received SIGTERM. Closing the server and database connection..."
  );
  closeDatabaseConnection();
  process.exit(0);
});


app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
