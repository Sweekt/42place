const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

const gridSize = 50; // Taille de la grille (ex: 50x50 pixels)
const pixelSize = 10; // Taille d'un pixel au départ

let offsetX = 0, offsetY = 0;
let scale = 1;
let isDragging = false;
let startX = 0, startY = 0;

// 🎨 Génère une grille de pixels colorés
const pixels: string[][] = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () =>
        `hsl(${Math.random() * 360}, 100%, 50%)`
    )
);

// 🔹 Dessine la grille de pixels avec le zoom et le déplacement
function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            ctx.fillStyle = pixels[y][x];
            ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            ctx.strokeStyle = "rgba(0,0,0,0.2)";
            ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
    }

    ctx.restore();
}

// 🖱 Gestion du déplacement (drag & drop)
canvas.addEventListener("mousedown", (event) => {
    isDragging = true;
    startX = event.clientX - offsetX;
    startY = event.clientY - offsetY;
});

canvas.addEventListener("mousemove", (event) => {
    if (!isDragging) return;
    offsetX = event.clientX - startX;
    offsetY = event.clientY - startY;
    draw();
});

canvas.addEventListener("mouseup", () => {
    isDragging = false;
});

// 🎡 Gestion du zoom avec la molette
canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    const scaleFactor = 1.1;
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    const newScale = event.deltaY < 0 ? scale * scaleFactor : scale / scaleFactor;

    // Limite le zoom (optionnel)
    if (newScale < 0.5 || newScale > 10) return;

    offsetX = mouseX - (mouseX - offsetX) * (newScale / scale);
    offsetY = mouseY - (mouseY - offsetY) * (newScale / scale);

    scale = newScale;
    draw();
});

// 🖌 Modifier un pixel au clic
canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left - offsetX) / scale;
    const mouseY = (event.clientY - rect.top - offsetY) / scale;

    const x = Math.floor(mouseX / pixelSize);
    const y = Math.floor(mouseY / pixelSize);

    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
        pixels[y][x] = "black"; // Change la couleur du pixel
        draw();
    }
});

draw();