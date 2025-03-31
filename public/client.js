var canvas = document.getElementById("gameCanvas");
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // Appel initial pour ajuster la taille dès le début
var gridSize = 200; // Taille de la grille (ex: 50x50 pixels)
var pixelSize = 10; // Taille d'un pixel au départ
var offsetX = 0, offsetY = 0;
var scale = 1;
var isDragging = false;
var startX = 0, startY = 0;
// 🎨 Génère une grille de pixels colorés
var pixels = Array.from({ length: gridSize }, function () {
    return Array.from({ length: gridSize }, function () {
        return "hsl(".concat(Math.random() * 360, ", 100%, 50%)");
    });
});
// 🔹 Dessine la grille de pixels avec le zoom et le déplacement
function draw() {
    if (!ctx)
        return;
    ctx.fillStyle = "#3d3d3d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);
    for (var y = 0; y < gridSize; y++) {
        for (var x = 0; x < gridSize; x++) {
            ctx.fillStyle = pixels[y][x];
            ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            //ctx.strokeStyle = "rgba(0,0,0,0.2)";
            //ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
    }
    ctx.restore();
}
// 🖱 Gestion du déplacement (drag & drop)
canvas.addEventListener("mousedown", function (event) {
    isDragging = true;
    startX = event.clientX - offsetX;
    startY = event.clientY - offsetY;
});
canvas.addEventListener("mousemove", function (event) {
    if (!isDragging)
        return;
    offsetX = event.clientX - startX;
    offsetY = event.clientY - startY;
    draw();
});
canvas.addEventListener("mouseup", function () {
    isDragging = false;
});
// 🎡 Gestion du zoom avec la molette
canvas.addEventListener("wheel", function (event) {
    event.preventDefault();
    var scaleFactor = 1.1;
    var mouseX = event.clientX - canvas.getBoundingClientRect().left;
    var mouseY = event.clientY - canvas.getBoundingClientRect().top;
    var newScale = event.deltaY < 0 ? scale * scaleFactor : scale / scaleFactor;
    // Limite le zoom (optionnel)
    if (newScale < 0.5 || newScale > 10)
        return;
    offsetX = mouseX - (mouseX - offsetX) * (newScale / scale);
    offsetY = mouseY - (mouseY - offsetY) * (newScale / scale);
    scale = newScale;
    draw();
});
// 🖌 Modifier un pixel au clic
canvas.addEventListener("click", function (event) {
    var rect = canvas.getBoundingClientRect();
    var mouseX = (event.clientX - rect.left - offsetX) / scale;
    var mouseY = (event.clientY - rect.top - offsetY) / scale;
    var x = Math.floor(mouseX / pixelSize);
    var y = Math.floor(mouseY / pixelSize);
    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
        pixels[y][x] = "black"; // Change la couleur du pixel
        draw();
    }
});
draw();
