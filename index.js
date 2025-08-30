const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const mainRouter = require("./routes/main.router");
// const mainRouter = require("./routes/main.router");


dotenv.config();

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/init");
const { addFile } = require("./controllers/add");
const { commitChanges } = require("./controllers/commit");
const { pushChanges } = require("./controllers/push");
const { pullChanges } = require("./controllers/pull");
const { revertChanges } = require("./controllers/revert");


yargs(hideBin(process.argv))
.command("start", "Starts a server", {}, startServer)
  .command("init", "Initialize the new repository", 
    {},
    initRepo)
    .command("add <file>", "Add a file to the repository", 
    (yargs) =>{
      yargs.positional("file", {
        describe: "The file to add",
        type: "string",
      });
    },
    (argv) => addFile(argv.file))
    .command("commit <message>", "Commit changes to the repository", 
    (yargs) =>{
      yargs.positional("message", {
        describe: "The commit message",
        type: "string",
      });
    },
    (argv) => 
    commitChanges(argv.message))
    .command("push", "Push changes to the remote repository", {}, pushChanges)
    .command("pull", "Pull changes from the remote repository", {}, pullChanges)
    .command("revert <commitID>", "Revert to a specific commit", 
    (yargs) =>{
      yargs.positional("commitID", {
        describe: "The ID of the commit to revert to",
        type: "string",
      });
    },
    (argv) => revertChanges(argv.commitID))
    .demandCommand(1, "You need at least one command")
    .help()
    .argv;

function startServer() {
  const app = express();
  const port = process.env.PORT || 3003;

  app.use (bodyParser.json());
  app.use(express.json());

  const mongoURI = process.env.MONGO_URI;
  mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

  app.use(cors({ origin: "*" }));
  app.use("/", mainRouter);
  


  let user = "test";

  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinRoom", (userID) => {
      user = userID;
      console.log("=====");
      console.log(user);
      console.log("=====");
      socket.join(userID);
    });
  });

  const db = mongoose.connection;

  db.once("open", async () => {
    console.log("CRUD operations called");
    // CRUD operations
  });

  httpServer.listen(port, () => {
    console.log(`Server is running on PORT ${port}`);
  });


}
