const WebSocket = require("ws");

const port = 10000; // Render の `Background Worker` では PORT 環境変数を使用しない
const wss = new WebSocket.Server({ port });

let players = {};

wss.on("connection", (ws) => {
    console.log("新しいプレイヤーが接続");

    ws.on("message", (data) => {
        try {
            const message = JSON.parse(data);

            if (message.type === "move") {
                players[message.id] = { x: message.x, y: message.y };

                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ type: "update", players }));
                    }
                });
            }
        } catch (error) {
            console.error("メッセージ解析エラー:", error);
        }
    });

    ws.on("close", () => {
        console.log("プレイヤーが退出");
    });

    ws.on("error", (err) => {
        console.error("WebSocketエラー:", err);
    });
});

console.log(`WebSocket サーバーがポート ${port} で起動しました`);
