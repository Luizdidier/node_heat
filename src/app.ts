import "dotenv/config";
import express from 'express';
import { router } from './routes';
import http from 'http';
import cors from 'cors';
import { Server } from "socket.io";

const { GITHUB_CLIENT_ID } = process.env;

const app = express();
app.use(cors());

const serverHttp = http.createServer(app);

const io = new Server(serverHttp, {
    cors: {
        origin: '*'
    }
});

io.on("connection", socket => {
    console.log("User connect", socket.id);
});

app.use(express.json());

app.get('/github', (request, response) => {
    response.redirect(
        `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}`
    );
})

app.get('/signin/callback', (request, response) => {
    const { code } = request.query;

    return response.json(code);
})

app.use(router);

export { serverHttp, io };
