// selecting all required elements

const dropArea = document.querySelector(".drag-area");
let files = []; // global var used inside multiple functions
const dragText = dropArea.querySelector("header");
const button = dropArea.querySelector("button");
const input = dropArea.querySelector("input");
var idTrack = 1;


const draggables = [];
const container = document.querySelector("insta-planner");

const instaPlanner = document.querySelector('.insta-planner');

button.onclick = ()=> {
    input.click(); // open input browser if user clicks on button
}
input.addEventListener("change", function() {
    files = this.files;
    dropArea.classList.add("active");
    showFile();

})

// If user drags file over DragArea
dropArea.addEventListener("dragover", (event)=> {
    event.preventDefault();
    dropArea.classList.add("active");
    dragText.textContent = "Release to Upload";
});

// If user leaves dragged file from DragArea
dropArea.addEventListener("dragleave", (event)=> {
    dropArea.classList.remove("active");
    dragText.textContent = "Drag&Drop to Upload";
});

// If user drops dragged file into DragArea
dropArea.addEventListener("drop", (event)=> {
    event.preventDefault(); // preventing image from automaticly oppening
    
    // getting the first photo 
    files = event.dataTransfer.files;
    console.log(files.length);
    showFile();
    dragText.textContent = "Drag&Drop to Upload";

    
});


// Function that adds the image to the respective div
function showFile() {
    for(const file of files) {
        let fileType = file.type;

        let validExtensions = ["image/jpeg", "image/jpg", "image/png"];
        if(validExtensions.includes(fileType)) { // selected file is an image
            let fileReader = new FileReader(); // new FileReader object
            fileReader.onload = () => {
                let fileURL = fileReader.result;
                // creating an img tag and passing content into it
                let imgTag = `<img src="${fileURL}" alt="">`;
                idTrack++;
                const new_div = document.createElement("div");
                new_div.className += "photo-area drag-transition"; 
                new_div.className += " alert alert-success alert-dismissible"; // built in Bootstrap classes for closing div
                new_div.innerHTML = imgTag;

                let closeButton = document.createElement('button');
                closeButton.setAttribute('type', 'button');
                closeButton.className += "btn-close";
                closeButton.textContent="x";
                closeButton.addEventListener('click', function(){
                    new_div.parentNode.removeChild(new_div);
                    });
                
                new_div.appendChild(closeButton);

                new_div.draggable = "true";
                instaPlanner.prepend(new_div);
                draggables.push(new_div);

                new_div.addEventListener('dragstart', () => {
                    new_div.classList.add("dragging");
                });

                new_div.addEventListener('dragend', () => {
                    new_div.classList.remove("dragging");
                });
                
                
            }
            fileReader.readAsDataURL(file);
        }
        else {
            alert("Please upload an Image File!")
            dropArea.classList.remove("active");
            dragText.textContent = "Drag&Drop to Upload";
        }
    };
}


// Functions used to achieve the drag functionality

var originalClickCoords = null; // original coordinated of the click, to know if the photo comes from before
                           // or after the desired position
var currentBox = null;

function insertAft(newNode, existingNode) {
    instaPlanner.insertBefore(newNode, existingNode.nextSibling);
}

function insertBfr(newNode, existingNode) {
    instaPlanner.insertBefore(newNode, existingNode);
}

instaPlanner.addEventListener('dragstart', e => {
    originalClickCoords = {x: e.clientX, y: e.clientY};
})

instaPlanner.addEventListener('dragover', e => {
    e.preventDefault();
    
    const targetElement = getDragAfterElement(e.clientX, e.clientY);
    const draggable = document.querySelector('.dragging');
    if (targetElement == null ) { // we are not above anything 
        instaPlanner.appendChild(draggable);
    } else {
        if ( originalClickCoords.y < currentBox.top) // on a row above
            insertAft(draggable, targetElement); 
        else if ( originalClickCoords.y <= currentBox.bottom && originalClickCoords.x < currentBox.left) // same row, before
            insertAft(draggable, targetElement);
        else 
            insertBfr(draggable, targetElement);
    }
})

function getDragAfterElement(x, y) {
    const draggableElements = [...instaPlanner.querySelectorAll('.photo-area:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        // const offset = box.left - x + box.width/2; // distance between the center of the square and our mouse cursor
        // find out closest element
        if ( x > box.left && x < box.right && y > box.top && y < box.bottom) // we are inside the square and can drop in it
            // if ( originalClickCoords.x < box.left || originalClickCoords.y < box.top) { // image was before => insert before
            {
                currentBox = box;
                console.log(currentBox.left);
                return child;
            }
        else {
            return closest;
        }

    });
}

