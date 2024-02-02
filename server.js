const express = require("express");
const app = express();
const { Server } = require("socket.io");
const helmet = require("helmet");
const server = require("http").createServer(app);
const session = require("express-session");

const cors = require("cors");
const authRouter = require("./routers/authRouter");
const {createClient} =  require("redis")
const RedisStore = require("connect-redis").default
require("dotenv").config();



const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: "true",
  },
});

let redisClient = createClient()
redisClient.connect().catch(console.error)

const redisStore = new RedisStore({
  client: redisClient
  
})

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    name: "sid",
    credentials: true,
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.ENVIRONMENT === "production" ? true : false,
      httpOnly: true,
      sameSite: process.env.ENVIRONMENT === "production" ? "none" : "lax",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  }
}));

app.use("/auth", authRouter);

io.on("connection", (socket) => {});

server.listen(8000, () => {
  console.log("server is running on port 8000");
});
