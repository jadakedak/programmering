const canvas = document.getElementById("Drawing-Canvas");
const ctx = canvas.getContext('2d')

document.getElementById("submit-color").onclick = function(){
    let set_background_color = document.getElementById("canvas-background-color").value
    canvas.style.backgroundColor = set_background_color
}

let drawn_shapes = [];
let drawn_lines = [];

let shapes_menu_button = document.getElementById("Shapes-Menu-Button")
let Shapes_Page = document.getElementById("Shapes")

let Pencils_Menu_Button = document.getElementById("Pencils-Menu-Button")
let Pencils_Page = document.getElementById("Pencils")

Pencils_Page.style.display = "none"

shapes_menu_button.onclick = () => {
    selected_pencil = null;
    Pencils_Page.style.display = "none"

    Shapes_Page.style.display = "block"
}
Pencils_Menu_Button.onclick = () => {
    Selected_shape = undefined;
    Shapes_Page.style.display = "none"

    Pencils_Page.style.display = "block"
}

function DrawShapes(){
    for(let shape of drawn_shapes){
        shape.draw()
    }
}
function DrawLines(){
    for(let line of drawn_lines){
        line.draw()
    }
}

function Update(){
    ctx.clearRect(0,0, canvas.width, canvas.height)
    DrawShapes()
    DrawLines()

    requestAnimationFrame(Update)
}
Update()
