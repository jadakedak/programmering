class Shape{
    constructor(x, y, width, height, type, color){
        this.x = x,
        this.y = y,
        this.width = width
        this.height = height
        this.type = type
        this.color = color

        this.Selected = false
    }

    Select(){
        this.Selected = !this.Selected
    }

    remove(){
        let index = drawn_shapes.indexOf(this)
        drawn_shapes.splice(index, 1)
    }

    draw(){
        if(drawn_shapes.includes(this)){
            ctx.fillStyle = this.color;
            switch(this.type){
                case "square":
                    ctx.fillRect(this.x, this.y, this.width, this.height)
                    break;
                case "circle":
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.width, 0, 2*Math.PI)
                    ctx.fill();
                    break;
            }
        }
    }
}

function getCanvasPos(canvas) {
    const rect = canvas.getBoundingClientRect();
    return { top: rect.top + window.scrollY, left: rect.left + window.scrollX };
}


let Selected_shape;
const shapes_container = document.getElementById("shapes-container")

const square_shape = document.getElementById("square-shape")
const circle_shape = document.getElementById("circle-shape")

const Selected_shape_preview = document.getElementById("Selected-Shape-Preview")

const clear_shapes = document.getElementById("clear-shapes")

let color = document.getElementById("Color").value;

square_shape.onclick = () => {
    Selected_shape = "square"
}
circle_shape.onclick = () => {
    Selected_shape = "circle"
}
clear_shapes.onclick = () => {
    drawn_shapes.splice(0, drawn_shapes.length)
}


// Preview When Hovering test
canvas.addEventListener("mouseover", () => {
    clearTimeout(mouseStopedTimeout)

    canvas.onmousemove = (event) => {
        let x = event.offsetX;
        let y = event.offsetY;
        
        color = document.getElementById("Color").value;

        if(Selected_shape){
            let Size = Selected_shape === "square" ? Square_size_slider.value : Circle_size_slider.value;
            
            let Preview_shape = new Shape(x, y, Size, Size, Selected_shape, color)
            drawn_shapes.push(Preview_shape)

            setTimeout(() => {
                let index = drawn_shapes.indexOf(Preview_shape)
                drawn_shapes.splice(index, 1)
            }, 10)
        }
    }
})



canvas.addEventListener("click", (event) => {
    if(Selected_shape == undefined){
        return;
    }
    let x = event.offsetX;
    let y = event.offsetY;

    color = document.getElementById("Color").value;

    let Size;
    Selected_shape === "square" ? Size = Square_size_slider.value : Size = Circle_size_slider.value;

    const New_Shape = new Shape(x, y, Size, Size, Selected_shape, color)
    drawn_shapes.push(New_Shape)
})
