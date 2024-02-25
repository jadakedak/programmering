var Square_size_slider = document.getElementById("Shape-Size");
var Square_size_display = document.getElementById("Square-Size-Display");

Square_size_display.textContent = Square_size_slider.value

Square_size_slider.oninput = () => {
    Square_size_display.textContent = Square_size_slider.value
}


var Circle_size_slider = document.getElementById("Circle-Size");
var Circle_size_display = document.getElementById("Circle-Size-Display");

Circle_size_display.textContent = Circle_size_slider.value

Circle_size_slider.oninput = () => {
    Circle_size_display.textContent = Circle_size_slider.value
}


var pencil_thickness_slider = document.getElementById("pencil-thickness")
var pencil_thickness_display = document.getElementById("pencil-thickness-display")

pencil_thickness_display.textContent = pencil_thickness_slider.value

pencil_thickness_slider.oninput = () => {
    pencil_thickness_display.textContent = pencil_thickness_slider.value
}