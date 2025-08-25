import express, { Application, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import Routes from "./routes/index.js";
import { Server } from "socket.io";
import { createServer } from 'node:http';
import { setupSocket } from "./socket.js";
import { waitRedisReady } from "./config/redis.config.js";
import { instrument } from "@socket.io/admin-ui";

const app: Application = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://admin.socket.io"],
    credentials: true,
  },
});

await waitRedisReady();

instrument(io, {
  auth: false,
  mode: "development",
});

setupSocket(io); 
export {io}



const PORT = process.env.PORT || 7000;

// * Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  return res.send("It's working");
});

// Routes
app.use('/api', Routes)

server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
