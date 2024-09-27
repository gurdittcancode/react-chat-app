import express from "express";
import { WebSocket } from "ws";
import http from "http";

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on("connection", function connection(ws) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(
                JSON.stringify({
                    name: "serverahahahahahahahahaha",
                    message: "New client has joined!",
                }),
            );
        }
    });

    ws.on("error", console.error);
    ws.on("message", function message(data, isBinary) {
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    });

    ws.on("close", () => {
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(
                    JSON.stringify({
                        name: "serverahahahahahahahahaha",
                        message: "Someone just left!",
                    }),
                );
            }
        });
    });
});

app.get("/", (req, res) => {
    res.json({
        msg: "ok",
    });
});

server.listen(3000, () => console.log("Server is on at 3000"));
