const container = document.getElementById("Container")
Container.style.display = "flex"
Container.style.flexWrap = 'wrap';

let imagepaths = [
    "https://media.istockphoto.com/id/1452588698/photo/beautiful-forest-scenery-with-pine-trees-and-green-moss.jpg?s=612x612&w=0&k=20&c=-h0LtjXCxAPzu_OS4xJ7c8jJ31JTk_a-9-Gs95qKW88=",
    "https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072821_1280.jpg",
    "https://cdn.pixabay.com/photo/2018/06/09/17/25/trees-3464777_1280.jpg",
    "https://cdn.pixabay.com/photo/2014/11/29/09/56/sleigh-ride-549727_1280.jpg",
    "https://cdn.pixabay.com/photo/2015/05/22/21/15/autumn-779827_1280.jpg"
];

let lågewidth = 100;
let lågeHeight = 100;

function ImagePathSelector(){
    let imagelength = imagepaths.length - 1
    let imagepathindex = Math.round(Math.random() * imagelength);
    return imagepaths[imagepathindex];
}

class låge{
    constructor(label, x, y, imagepath){
        this.x = x;
        this.y = y;
        this.label = label;
        this.imagePath = imagepath;

        this.Cover = document.createElement("div")
            this.Cover.id = "Cover"
            this.Cover.style.width = `${lågewidth}px`
            this.Cover.style.height = `${lågeHeight}px`

        this.Container = document.createElement("div");
            this.Container.id = "Låge-Container"
            this.Container.style.width = `${lågewidth}px`
            this.Container.style.height = `${lågeHeight}px`

        this.Label = document.createElement("label");
            this.Label.textContent = this.label;
            this.Label.style.color = "red";
        
        this.image = document.createElement("img");
            this.image.src = this.imagePath;
            this.image.style.width = `${lågewidth}px`;
            this.image.style.height = `${lågeHeight}px`;
    }

    Create(){
        this.Container.appendChild(this.Label)
        if(this.imagePath){
            this.Container.appendChild(this.image)
        }
        this.Container.appendChild(this.Cover)
        container.appendChild(this.Container)
    }

    addContainerListener(){
        this.Container.addEventListener("click", () => {
            if(this.Container.contains(this.Cover)){
                this.Container.removeChild(this.Cover)
            }else{
                this.Container.appendChild(this.Cover)
            }
        })

        this.Container.addEventListener("mouseover", () => {
            this.Container.style.width = lågeWidth + 25
            this.Container.style.height = lågeHeight + 25
        })
    }
}

let objects = [];
let count = 1;

for(let y = 0; 1000 > y; y += lågeHeight){
    for(let x = 0; 1000 > x; x += lågewidth){
        if(count >= 25){
            // do nothing
        }else{
            objects.push(new låge(count, x, y, ImagePathSelector()))
            count++
        }
    }
}

for(let object of objects){
    object.Create()
    object.addContainerListener()
}
