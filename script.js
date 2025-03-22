const socket = new WebSocket("wss://maze-game-server.onrender.com");

const playerId = Math.random().toString(36).substr(2, 9);
let players = {};
let player = { x: 1, y: 1 };

socket.addEventListener("open", () => {
    console.log("WebSocket 接続成功");
});

socket.addEventListener("message", (event) => {
    try {
        const data = JSON.parse(event.data);
        if (data.type === "update") {
            players = data.players;
            draw();
        }
    } catch (error) {
        console.error("受信データの解析エラー:", error);
    }
});

socket.addEventListener("close", () => {
    console.log("WebSocket 接続が閉じられました。再接続を試みます...");
    setTimeout(() => {
        location.reload(); // ページをリロードして再接続
    }, 2000);
});

socket.addEventListener("error", (error) => {
    console.error("WebSocket エラー:", error);
});

function movePlayer(dx, dy) {
    player.x += dx;
    player.y += dy;
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "move", id: playerId, x: player.x, y: player.y }));
    }
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") movePlayer(0, -1);
    if (event.key === "ArrowDown") movePlayer(0, 1);
    if (event.key === "ArrowLeft") movePlayer(-1, 0);
    if (event.key === "ArrowRight") movePlayer(1, 0);
});

function draw() {
    const canvas = document.getElementById("maze");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    Object.entries(players).forEach(([id, p]) => {
        ctx.fillStyle = id === playerId ? "blue" : "red"; // 自分のIDなら青、それ以外は赤
        ctx.fillRect(p.x * 20, p.y * 20, 20, 20);
    });
}
