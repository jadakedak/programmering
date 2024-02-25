class Pencil {
    constructor(x, y, width, height, type, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.color = color;
        this.Selected = false;
        this.points = []; // Store intermediate points
    }

    remove() {
        let index = drawn_lines.indexOf(this);
        if (index > -1) {
            drawn_lines.splice(index, 1);
        }
    }

    draw() {
        if (drawn_lines.includes(this)) {
            switch (this.type) {
                case "normal-pencil":
                    ctx.strokeStyle = this.color;
                    ctx.lineWidth = this.width;
                    ctx.lineJoin = ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(this.points[0].x, this.points[0].y);
                    for (let i = 1; i < this.points.length; i++) {
                        ctx.lineTo(this.points[i].x, this.points[i].y);
                    }
                    ctx.stroke();
                    break;
                case "delete-pencil":
                    let background_color = canvas.style.backgroundColor;
                    ctx.fillStyle = background_color;
                    for (let point of this.points) {
                        ctx.beginPath();
                        ctx.arc(point.x, point.y, this.width / 2, 0, 2 * Math.PI);
                        ctx.fill();
                    }
                    break;
            }
        }
    }
}

document.getElementById("clear-lines").onclick = () => {
    drawn_lines.splice(0, drawn_lines.length);
}

let selected_pencil;
let isDrawing = false;

let pencil_thickness = document.getElementById("pencil-thickness");

document.getElementById("normal-pencil").onclick = function() {
    selected_pencil = "normal-pencil";
};
document.getElementById("delete-pencil").onclick = function() {
    selected_pencil = "delete-pencil";
}

canvas.addEventListener("mousedown", (event) => {
    if (event.button === 0) {
        isDrawing = true;
    }
    if (isDrawing && selected_pencil) {
        let x = event.offsetX;
        let y = event.offsetY;
        let color = document.getElementById("pencil-color").value;

        const line = new Pencil(x, y, pencil_thickness.value, pencil_thickness.value, selected_pencil, color);
        drawn_lines.push(line);
        line.points.push({x: x, y: y});
    }
});

document.addEventListener("mouseup", () => {
    isDrawing = false;
});

canvas.addEventListener("mouseleave", () => {
    isDrawing = false;
});

canvas.addEventListener("mousemove", (event) => {
    if (isDrawing && selected_pencil) {
        let x = event.offsetX;
        let y = event.offsetY;

        const line = drawn_lines[drawn_lines.length - 1];
        line.points.push({x: x, y: y}); // Store intermediate points
        line.draw();
    }
});
