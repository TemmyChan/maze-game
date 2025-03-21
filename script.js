const socket = new WebSocket("wss://your-websocket-url.up.railway.app");

const playerId = Math.random().toString(36).substr(2, 9);
let players = {};
let player = { x: 1, y: 1 };

socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "update") {
        players = data.players;
        draw();
    }
});

function movePlayer(dx, dy) {
    player.x += dx;
    player.y += dy;
    socket.send(JSON.stringify({ type: "move", id: playerId, x: player.x, y: player.y }));
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

    Object.values(players).forEach(p => {
        ctx.fillStyle = p === player ? "blue" : "red";
        ctx.fillRect(p.x * 20, p.y * 20, 20, 20);
    });
}
