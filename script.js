let socket;

function connect() {
    socket = new WebSocket("wss://maze-game-server.onrender.com:10000");

    socket.addEventListener("open", () => {
        console.log("WebSocket接続成功");
    });

    socket.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "update") {
            players = data.players;
            draw();
        }
    });

    socket.addEventListener("close", () => {
        console.log("WebSocket接続が閉じられました");
    });

    socket.addEventListener("error", (error) => {
        console.log("WebSocketエラー:", error);
    });
}

// 最初に接続
connect();

// もし接続が切断された場合に再接続
socket.addEventListener("close", () => {
    console.log("接続が切断されたため再接続します...");
    connect();
});
